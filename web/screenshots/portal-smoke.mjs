import { chromium } from "@playwright/test"

const results = []

async function check(name, fn) {
  try {
    await fn()
    results.push({ name, ok: true })
  } catch (error) {
    results.push({ name, ok: false, error: error?.message ?? String(error) })
  }
}

const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--no-sandbox", "--disable-setuid-sandbox"],
})

const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await context.newPage()
const consoleIssues = []

page.on("pageerror", (error) => consoleIssues.push(`pageerror: ${error.message}`))
page.on("console", (message) => {
  const text = message.text()
  if (text.includes("GPU stall due to ReadPixels")) return
  if (text.includes("CONTEXT_LOST_WEBGL")) return
  if (["error", "warning"].includes(message.type())) {
    consoleIssues.push(`${message.type()}: ${text}`)
  }
})

await check("home desktop renders", async () => {
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" })
  await page.waitForSelector("text=CJPA", { timeout: 10000 })
})

await check("mobile nav opens", async () => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" })
  await page.getByRole("button", { name: /open menu/i }).click()
  await page.waitForSelector("text=Client Portal", { timeout: 5000 })
})

await check("unauthenticated portal redirects to login", async () => {
  await page.goto("http://localhost:3000/portal", { waitUntil: "networkidle" })
  await page.waitForURL("**/login", { timeout: 10000 })
})

await check("invalid login shows error", async () => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" })
  await page.locator("#portalId").fill("bad-id")
  await page.getByRole("button", { name: /access portal/i }).click()
  await page.waitForSelector("text=Invalid portal ID", { timeout: 10000 })
})

await check("valid login reaches overview", async () => {
  await page.locator("#portalId").fill("earlcarr")
  await page.getByRole("button", { name: /access portal/i }).click()
  await page.waitForURL("**/portal", { timeout: 10000 })
  await page.waitForSelector("text=Overview", { timeout: 10000 })
})

await check("portal mobile has no horizontal overflow", async () => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("http://localhost:3000/portal", { waitUntil: "networkidle" })
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2)
  if (overflow) {
    const widths = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }))
    throw new Error(`horizontal overflow: ${widths.scrollWidth} > ${widths.innerWidth}`)
  }
})

await browser.close()

if (consoleIssues.length) {
  results.push({ name: "console issues", ok: false, error: consoleIssues.join("\\n") })
}

console.table(results)

if (results.some((result) => !result.ok)) {
  process.exit(1)
}
