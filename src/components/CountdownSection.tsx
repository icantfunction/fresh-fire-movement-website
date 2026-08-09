import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { PRODUCTION_DATE, resolveWinterPhase } from '@/lib/season';

const CountdownSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const targetDate = PRODUCTION_DATE.getTime();
  // Read once on mount. The phase only changes at midnight boundaries, so re-deriving it
  // every render would buy nothing.
  const [phase] = useState(() => resolveWinterPhase());
  const isDay = phase >= 4;

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = Date.now();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        return false;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });

      return true;
    };

    updateTimeLeft();
    const timer = setInterval(() => {
      const shouldContinue = updateTimeLeft();
      if (!shouldContinue) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  const eyebrow = isDay ? 'The Day Is Here' : phase >= 1 ? 'This Advent Season' : 'Coming Soon';

  return (
    <section
      data-winter-phase={phase}
      className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-[#0f0820] via-fire-deep to-[#1a0b2e]"
    >
      {/* Phase 1+: the warm gold wash goes cold, so the gold that remains reads as
          candlelight against it rather than as the ambient temperature. */}
      <div
        className={
          phase >= 1
            ? 'absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(191,219,254,0.12),transparent_60%)] pointer-events-none'
            : 'absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.08),transparent_60%)] pointer-events-none'
        }
      />

      {/* Phase 3: candlelight rising from the floor of the section. */}
      {phase >= 3 && (
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.16),transparent_70%)] pointer-events-none" />
      )}

      {/* Phase 2: evergreen ridge along the bottom edge. */}
      {phase >= 2 && (
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 w-full h-16 md:h-24 pointer-events-none text-[#0b1a14] opacity-70"
        >
          <path
            fill="currentColor"
            d="M0 120 L0 104 L8 68 L16 104 L26 46 L36 104 L48 82 L60 104 L74 54 L88 104 L104 76 L120 104 L128 38 L136 104 L146 86 L156 104 L168 62 L180 104 L194 50 L208 104 L224 78 L240 104 L248 58 L256 104 L266 84 L276 104 L288 42 L300 104 L314 72 L328 104 L344 52 L360 104 L368 80 L376 104 L386 64 L396 104 L408 34 L420 104 L434 76 L448 104 L464 56 L480 104 L488 82 L496 104 L506 48 L516 104 L528 70 L540 104 L554 60 L568 104 L584 86 L600 104 L608 44 L616 104 L626 74 L636 104 L648 54 L660 104 L674 78 L688 104 L704 40 L720 104 L728 66 L736 104 L746 58 L756 104 L768 84 L780 104 L794 50 L808 104 L824 72 L840 104 L848 62 L856 104 L866 76 L876 104 L888 46 L900 104 L914 80 L928 104 L944 52 L960 104 L968 68 L976 104 L986 56 L996 104 L1008 82 L1020 104 L1034 42 L1048 104 L1064 74 L1080 104 L1088 64 L1096 104 L1106 48 L1116 104 L1128 78 L1140 104 L1154 60 L1168 104 L1184 70 L1200 104 L1200 120 Z"
          />
        </svg>
      )}

      <div className="relative max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 mb-6">
          <span className={`h-px w-12 ${phase >= 1 ? 'bg-[#BFDBFE]/60' : 'bg-fire-gold/60'}`} />
          <span
            className={`text-xs md:text-sm font-semibold tracking-[0.3em] uppercase ${
              phase >= 1 ? 'text-[#BFDBFE]' : 'text-fire-gold'
            }`}
          >
            {eyebrow}
          </span>
          <span className={`h-px w-12 ${phase >= 1 ? 'bg-[#BFDBFE]/60' : 'bg-fire-gold/60'}`} />
        </div>

        {/* Phase 3: the Bethlehem star, reusing the existing fire-glow keyframe slowed
            to a candle-like pulse. */}
        {phase >= 3 && (
          <div aria-hidden="true" className="relative flex justify-center mb-4">
            <div className="absolute w-32 h-32 -top-10 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.35),transparent_70%)] blur-xl" />
            <svg viewBox="0 0 24 24" className="relative w-10 h-10 text-fire-gold animate-star-twinkle">
              <path
                fill="currentColor"
                d="M12 0 L13.6 9.2 L22 12 L13.6 14.8 L12 24 L10.4 14.8 L2 12 L10.4 9.2 Z"
              />
            </svg>
          </div>
        )}

        <h2 className="text-5xl md:text-8xl font-black tracking-tight text-white mb-12">
          CHRISTMAS PRODUCTION
        </h2>

        {isDay ? (
          <div className="mb-12">
            <p className="text-3xl md:text-5xl font-black text-fire-gold tracking-tight">
              Today &middot; 9:00 AM
            </p>
            <p className="mt-3 text-white/80 tracking-wide">
              Main Sanctuary &middot; doors open at 8:30
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 md:gap-4 mb-12 max-w-3xl mx-auto">
            {units.map((unit) => (
              <div
                key={unit.label}
                className={`relative rounded-lg p-4 md:p-8 backdrop-blur-sm ${
                  phase >= 2
                    ? 'bg-white/[0.08] border border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]'
                    : 'bg-white/[0.04] border border-white/10'
                }`}
              >
                <div
                  className={`absolute top-0 left-1/2 -translate-x-1/2 h-px w-12 ${
                    phase >= 2 ? 'bg-[#BFDBFE]' : 'bg-fire-gold'
                  }`}
                />
                <div
                  className={`text-4xl md:text-7xl font-bold tabular-nums tracking-tight leading-none ${
                    phase >= 3 ? 'text-fire-gold' : 'text-white'
                  }`}
                >
                  {unit.value.toString().padStart(2, '0')}
                </div>
                <div className="mt-2 md:mt-4 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* On the day itself the call-out above already states time and room, so this
            row would just repeat it. */}
        {!isDay && (
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <Calendar className={`w-4 h-4 ${phase >= 1 ? 'text-[#BFDBFE]' : 'text-fire-gold'}`} />
              <span className="font-semibold tracking-wide">December 20, 2026</span>
            </div>
            <span className="hidden md:inline-block h-1 w-1 rounded-full bg-white/30" />
            <div className="flex items-center gap-2">
              <Clock className={`w-4 h-4 ${phase >= 1 ? 'text-[#BFDBFE]' : 'text-fire-gold'}`} />
              <span className="font-semibold tracking-wide">9:00 AM</span>
            </div>
            <span className="hidden md:inline-block h-1 w-1 rounded-full bg-white/30" />
            <div className="flex items-center gap-2">
              <MapPin className={`w-4 h-4 ${phase >= 1 ? 'text-[#BFDBFE]' : 'text-fire-gold'}`} />
              <span className="font-semibold tracking-wide">Main Sanctuary</span>
            </div>
          </div>
        )}

        <p className="mt-3 text-sm text-white/50 tracking-wide">
          Christian Life Center &middot; 2699 W Commercial Blvd, Fort Lauderdale, FL
        </p>
      </div>
    </section>
  );
};

export default CountdownSection;
