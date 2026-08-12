/**
 * Proves the vendor-widget guard removes a host-injected badge.
 *
 * The real badge is added by Lovable's hosting layer, so it never appears on a local
 * preview. This replays it: a replica of the served markup is injected at three different
 * moments (before app scripts run, right after load, and long after hydration), and the
 * guard must clear all three.
 *
 * Playwright is not a project dependency — install on demand:
 *   npm run build && npm run preview
 *   npm i --no-save playwright && npx playwright install chromium
 *   node scripts/verify-widget-block.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:4173";

// Mirrors the structure Lovable serves, including inline !important, which would defeat a
// stylesheet-only defence.
const BADGE_HTML = `
  <div id="lovable-badge" style="position:fixed!important;bottom:16px!important;right:16px!important;display:flex!important;z-index:2147483647!important;">
    <a id="lovable-badge-cta" href="https://lovable.dev/projects/lovp-test">
      <span id="lovable-badge-text">Edit with Lovable</span>
    </a>
    <div id="lovable-badge-divider"></div>
    <button id="lovable-badge-close">x</button>
  </div>`;

const inject = `(() => {
  const host = document.createElement('div');
  host.innerHTML = ${JSON.stringify(BADGE_HTML)};
  document.body.appendChild(host.firstElementChild);
})()`;

const browser = await chromium.launch();
let failures = 0;

const check = async (label, run) => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await run(page);

  // Give the observer a chance to react.
  await page.waitForTimeout(600);

  const present = await page.locator("#lovable-badge").count();
  const visible = present
    ? await page.evaluate(() => {
        const el = document.querySelector("#lovable-badge");
        if (!el) return false;
        const cs = getComputedStyle(el);
        return cs.display !== "none" && cs.visibility !== "hidden";
      })
    : false;

  const ok = present === 0 && !visible && errors.length === 0;
  if (!ok) failures++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${label.padEnd(34)} nodes=${present} visible=${visible}` +
      (errors.length ? ` errors=${errors.join("; ")}` : "")
  );

  await context.close();
};

// 1. Present in the initial HTML, before any of our JS parses.
await check("badge in initial document", async (page) => {
  await page.addInitScript(`
    document.addEventListener('DOMContentLoaded', () => { ${inject} }, { once: true });
  `);
  await page.goto(BASE, { waitUntil: "networkidle" });
});

// 2. Injected immediately after load, the common hosting behaviour.
await check("badge injected after load", async (page) => {
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate(inject);
});

// 3. Injected late, e.g. after a client-side route change.
await check("badge injected late (3s)", async (page) => {
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);
  await page.evaluate(inject);
});

// 4. Re-injected repeatedly — the observer must not give up after the first sweep.
await check("badge re-injected 5x", async (page) => {
  await page.goto(BASE, { waitUntil: "networkidle" });
  for (let i = 0; i < 5; i++) {
    await page.evaluate(inject);
    await page.waitForTimeout(150);
  }
});

// The app's own fixed UI must survive — a blanket rule would have broken this.
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await context.newPage();
await page.goto(BASE, { waitUntil: "networkidle" });
const navPresent = await page.locator("nav, header, section").first().count();
const heroPresent = await page.locator("section").count();
const ok = navPresent > 0 && heroPresent > 2;
if (!ok) failures++;
console.log(`${ok ? "PASS" : "FAIL"}  app's own UI intact${" ".repeat(15)} sections=${heroPresent}`);
await context.close();

await browser.close();
console.log(failures === 0 ? "\nAll widget-block checks passed." : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
