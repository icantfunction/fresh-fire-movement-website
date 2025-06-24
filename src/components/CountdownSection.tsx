
import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

const CountdownSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set target date - you can modify this to the actual event date
  const targetDate = new Date('2024-12-31T19:00:00').getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section className="py-20 px-4 royal-gradient">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
          Next Worship Production
        </h2>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item, index) => (
              <div key={index}>
                <div className="bg-white/20 rounded-xl p-4 md:p-6">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm md:text-base text-gray-200 uppercase tracking-wider">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-4 text-white">
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5 text-fire-gold" />
              <span className="text-lg">FLC Auditorium, Christian Life Center</span>
            </div>
            <div className="text-base text-gray-200">
              2699 W Commercial Blvd, Fort Lauderdale, FL
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-fire-gold" />
              <span className="text-lg font-semibold">7:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;
