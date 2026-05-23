import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

const CountdownSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const targetDate = new Date('2026-08-07T19:00:00').getTime();

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

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-[#0f0820] via-fire-deep to-[#1a0b2e]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.08),transparent_60%)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 mb-6">
          <span className="h-px w-12 bg-fire-gold/60" />
          <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-fire-gold uppercase">
            Coming Soon
          </span>
          <span className="h-px w-12 bg-fire-gold/60" />
        </div>

        <h2 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-3">
          DISPATCH
        </h2>
        <p className="text-fire-gold font-semibold tracking-[0.25em] uppercase text-xs md:text-sm mb-12">
          Luke 10:1&ndash;13, 20
        </p>

        <div className="grid grid-cols-4 gap-2 md:gap-4 mb-12 max-w-3xl mx-auto">
          {units.map((unit) => (
            <div
              key={unit.label}
              className="relative bg-white/[0.04] border border-white/10 rounded-lg p-4 md:p-8 backdrop-blur-sm"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-12 bg-fire-gold" />
              <div className="text-4xl md:text-7xl font-bold text-white tabular-nums tracking-tight leading-none">
                {unit.value.toString().padStart(2, '0')}
              </div>
              <div className="mt-2 md:mt-4 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                {unit.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-white/90">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-fire-gold" />
            <span className="font-semibold tracking-wide">August 7, 2026</span>
          </div>
          <span className="hidden md:inline-block h-1 w-1 rounded-full bg-white/30" />
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-fire-gold" />
            <span className="font-semibold tracking-wide">7:00 PM</span>
          </div>
          <span className="hidden md:inline-block h-1 w-1 rounded-full bg-white/30" />
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-fire-gold" />
            <span className="font-semibold tracking-wide">Main Sanctuary</span>
          </div>
        </div>

        <p className="mt-3 text-sm text-white/50 tracking-wide">
          Christian Life Center &middot; 2699 W Commercial Blvd, Fort Lauderdale, FL
        </p>
      </div>
    </section>
  );
};

export default CountdownSection;
