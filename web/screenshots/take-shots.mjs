import { chromium } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--no-sandbox", "--disable-setuid-sandbox"],
});

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
  });
  const page = await ctx.newPage();

  // Log console errors
  page.on("pageerror", (e) => console.error(`[${vp.name}] page error:`, e.message));

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  // Wait for splash to finish (2800ms) + animations (700ms buffer)
  await page.waitForTimeout(3600);

  // Wait until the globe canvas transitions to opacity 1 (or timeout)
  await page.waitForFunction(
    () => {
      const canvas = document.querySelector("canvas");
      return canvas && canvas.style.opacity === "1";
    },
    { timeout: 5000 }
  ).catch(() => console.log(`[${vp.name}] canvas opacity wait timed out`));

  await page.screenshot({
    path: path.join(__dirname, `${vp.name}.png`),
    fullPage: false,
  });

  console.log(`✓ ${vp.name} screenshot saved`);
  await ctx.close();
}

await browser.close();
console.log("All screenshots done.");
