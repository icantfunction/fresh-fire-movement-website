/**
 * Winter theming ramps up on its own as the Christmas production approaches, so the
 * site escalates without anyone editing code in November or December.
 *
 * Phases:
 *   0 — off. Normal Fresh Fire look.
 *   1 — cold accent only. Frost-toned glow, "This Advent Season" eyebrow.
 *   2 — clearly seasonal. Snow on the hero, frosted countdown tiles, evergreen ridge.
 *   3 — production push. Bethlehem star, gold-on-frost digits, candlelight vignette.
 *   4 — the day itself and after. Countdown is replaced by the service call-out.
 */
export type WinterPhase = 0 | 1 | 2 | 3 | 4;

/** 2026-12-20T09:00:00 local — the production. Shared with CountdownSection. */
export const PRODUCTION_DATE = new Date("2026-12-20T09:00:00");

// Local-midnight boundaries. Written as explicit constructor args rather than parsed
// strings, because "2026-11-01" parses as UTC and would flip the phase a few hours
// early for anyone east of Greenwich.
const PHASE_STARTS: { phase: WinterPhase; at: Date }[] = [
  { phase: 3, at: new Date(2026, 11, 13, 0, 0, 0) }, // Dec 13
  { phase: 2, at: new Date(2026, 10, 28, 0, 0, 0) }, // Nov 28
  { phase: 1, at: new Date(2026, 10, 1, 0, 0, 0) }, // Nov 1
];

/**
 * Which winter phase is active. `now` is injectable so the phase schedule can be tested
 * against future dates without touching the system clock.
 */
export const getWinterPhase = (now: Date = new Date()): WinterPhase => {
  if (now.getTime() >= PRODUCTION_DATE.getTime()) return 4;
  for (const { phase, at } of PHASE_STARTS) {
    if (now.getTime() >= at.getTime()) return phase;
  }
  return 0;
};

/**
 * Reads `?winter=N` so the team can preview any phase on the live site before its date
 * arrives. Out-of-range or absent values fall through to the real schedule.
 */
export const resolveWinterPhase = (search?: string, now?: Date): WinterPhase => {
  const query = search ?? (typeof window !== "undefined" ? window.location.search : "");
  const override = new URLSearchParams(query).get("winter");
  if (override !== null) {
    const parsed = Number(override);
    if (Number.isInteger(parsed) && parsed >= 0 && parsed <= 4) {
      return parsed as WinterPhase;
    }
  }
  return getWinterPhase(now);
};
