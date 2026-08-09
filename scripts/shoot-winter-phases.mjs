/**
 * Loads the built site with the browser clock faked to each phase date and captures
 * screenshots. This exercises the real date schedule end-to-end — not the ?winter=
 * preview override — so it proves the phases actually turn themselves on.
 *
 * Playwright is intentionally NOT a dependency of this project — it would add ~300MB for
 * a script that runs a few times a year. Install it on demand:
 *
 *   npm run build && npm run preview          # in another shell
 *   npm i --no-save playwright && npx playwright install chromium
 *   node scripts/shoot-winter-phases.mjs
 */
import { chromium } from "playwright";
import { mkdirSync } from "fs";

const BASE = process.env.BASE_URL || "http://localhost:4173";
const OUT = process.env.OUT_DIR || "winter-shots";

const SHOTS = [
  { name: "phase0-today", date: "2026-08-08T12:00:00", expect: 0 },
  { name: "phase1-nov01", date: "2026-11-01T10:00:00", expect: 1 },
  { name: "phase2-nov28", date: "2026-11-28T10:00:00", expect: 2 },
  { name: "phase3-dec13", date: "2026-12-13T10:00:00", expect: 3 },
  { name: "phase4-dec20", date: "2026-12-20T09:30:00", expect: 4 },
];

const VIEWPORTS = [
  { tag: "mobile", width: 390, height: 844 },
  { tag: "desktop", width: 1440, height: 900 },
];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
let failures = 0;

for (const vp of VIEWPORTS) {
  for (const shot of SHOTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });

    // Freeze the clock before any app code runs.
    await context.addInitScript(`{
      const fixed = new Date(${JSON.stringify(shot.date)}).getTime();
      const RealDate = Date;
      class FakeDate extends RealDate {
        constructor(...args) {
          if (args.length === 0) super(fixed);
          else super(...args);
        }
        static now() { return fixed; }
      }
      FakeDate.parse = RealDate.parse;
      FakeDate.UTC = RealDate.UTC;
      globalThis.Date = FakeDate;
    }`);

    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(BASE, { waitUntil: "networkidle" });

    const section = page.locator("[data-winter-phase]");
    await section.waitFor({ timeout: 10000 });
    const actual = Number(await section.getAttribute("data-winter-phase"));

    // Let the flake field populate before capturing.
    await page.waitForTimeout(900);

    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: `${OUT}/${vp.tag}-${shot.name}-countdown.png`,
    });

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/${vp.tag}-${shot.name}-hero.png` });

    const snowExpected = shot.expect >= 2;
    const snowPresent = (await page.locator("section canvas").count()) > 0;

    const ok = actual === shot.expect && snowPresent === snowExpected && errors.length === 0;
    if (!ok) failures++;

    console.log(
      `${ok ? "PASS" : "FAIL"}  ${vp.tag.padEnd(7)} ${shot.name.padEnd(14)} ` +
        `phase=${actual}(want ${shot.expect}) snow=${snowPresent}(want ${snowExpected})` +
        (errors.length ? ` errors=${errors.join("; ")}` : "")
    );

    await context.close();
  }
}

await browser.close();
console.log(failures === 0 ? `\nAll checks passed. Shots in ${OUT}/` : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
