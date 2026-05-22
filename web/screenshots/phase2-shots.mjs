import { chromium } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--no-sandbox", "--disable-setuid-sandbox"],
});

async function shoot(name, scrollTo, viewport = { width: 1440, height: 900 }) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.error(`[${name}] error:`, e.message));
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(3400); // wait for splash

  if (scrollTo) {
    await page.evaluate((selector) => {
      const el = document.querySelector(selector);
      if (el) el.scrollIntoView({ behavior: "instant" });
    }, scrollTo);
    await page.waitForTimeout(600); // let inView animations trigger
  }

  await page.screenshot({
    path: path.join(__dirname, `${name}.png`),
    fullPage: false,
  });
  console.log(`✓ ${name}`);
  await ctx.close();
}

// Desktop shots of each section
await shoot("about-desktop", "#about");
await shoot("services-desktop", "#services");
await shoot("team-desktop", "#team");

// Mobile full-page scroll of about
await shoot("about-mobile", "#about", { width: 390, height: 844 });
await shoot("team-mobile", "#team", { width: 390, height: 844 });

await browser.close();
console.log("Done.");
