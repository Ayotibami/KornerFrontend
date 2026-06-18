// Run with: npx playwright@1.61.0 node screenshot-calendar.mjs
import { chromium } from "playwright";

const BASE = "http://localhost:3000";

async function run() {
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: "iphone-se",  width: 375, height: 667 },
    { name: "iphone-14",  width: 390, height: 844 },
    { name: "desktop",    width: 1280, height: 800 },
  ];

  for (const vp of viewports) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await ctx.newPage();

    await page.goto(`${BASE}/admin/newsletter`, { waitUntil: "networkidle" });
    console.log(`[${vp.name}] URL after nav: ${page.url()}`);
    await page.screenshot({ path: `ss-${vp.name}-initial.png`, fullPage: false });

    try {
      const scheduleBtn = page.getByText("Schedule").first();
      await scheduleBtn.click({ timeout: 3000 });
      await page.waitForTimeout(500);
      await page.screenshot({ path: `ss-${vp.name}-schedule.png`, fullPage: true });
      console.log(`[${vp.name}] Schedule view captured`);
    } catch {
      console.log(`[${vp.name}] Could not click Schedule`);
    }

    await ctx.close();
  }

  await browser.close();
  console.log("Done.");
}

run().catch(console.error);
