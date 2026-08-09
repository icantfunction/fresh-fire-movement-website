/**
 * Asserts the winter phase schedule flips on exactly the intended local dates.
 *
 * Run: node scripts/verify-winter-phases.mjs
 *
 * Mirrors the boundaries in src/lib/season.ts. Kept as a plain script because the repo
 * has no test runner configured.
 */
const PRODUCTION_DATE = new Date("2026-12-20T09:00:00");

const PHASE_STARTS = [
  { phase: 3, at: new Date(2026, 11, 13, 0, 0, 0) },
  { phase: 2, at: new Date(2026, 10, 28, 0, 0, 0) },
  { phase: 1, at: new Date(2026, 10, 1, 0, 0, 0) },
];

const getWinterPhase = (now) => {
  if (now.getTime() >= PRODUCTION_DATE.getTime()) return 4;
  for (const { phase, at } of PHASE_STARTS) {
    if (now.getTime() >= at.getTime()) return phase;
  }
  return 0;
};

const cases = [
  ["2026-08-08 today", new Date(2026, 7, 8, 12, 0), 0],
  ["2026-10-31 23:59 (day before phase 1)", new Date(2026, 9, 31, 23, 59, 59), 0],
  ["2026-11-01 00:00 (phase 1 opens)", new Date(2026, 10, 1, 0, 0, 0), 1],
  ["2026-11-15 mid phase 1", new Date(2026, 10, 15, 12, 0), 1],
  ["2026-11-27 23:59 (last of phase 1)", new Date(2026, 10, 27, 23, 59, 59), 1],
  ["2026-11-28 00:00 (phase 2 opens)", new Date(2026, 10, 28, 0, 0, 0), 2],
  ["2026-12-12 23:59 (last of phase 2)", new Date(2026, 11, 12, 23, 59, 59), 2],
  ["2026-12-13 00:00 (phase 3 opens)", new Date(2026, 11, 13, 0, 0, 0), 3],
  ["2026-12-20 08:59 (morning of, pre-service)", new Date(2026, 11, 20, 8, 59, 0), 3],
  ["2026-12-20 09:00 (service begins)", new Date(2026, 11, 20, 9, 0, 0), 4],
  ["2026-12-21 day after", new Date(2026, 11, 21, 10, 0), 4],
];

let failed = 0;
for (const [label, when, expected] of cases) {
  const actual = getWinterPhase(when);
  const ok = actual === expected;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  phase ${actual} (want ${expected})  ${label}`);
}

console.log(
  failed === 0
    ? `\nAll ${cases.length} phase boundaries correct.`
    : `\n${failed} of ${cases.length} boundaries WRONG.`
);
process.exit(failed === 0 ? 0 : 1);
