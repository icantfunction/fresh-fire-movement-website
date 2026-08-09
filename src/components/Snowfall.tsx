import { useEffect, useRef } from "react";

interface SnowfallProps {
  /** Flake count. Kept low deliberately — this sits behind hero text on phones. */
  count?: number;
  className?: string;
}

interface Flake {
  x: number;
  y: number;
  r: number;
  drift: number;
  speed: number;
  alpha: number;
}

/**
 * Canvas snow for the hero. Canvas rather than DOM nodes so 50 flakes cost one element
 * instead of fifty, and the whole thing is skipped outright when the visitor asks for
 * reduced motion.
 */
const Snowfall = ({ count = 50, className = "" }: SnowfallProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (reduceMotion?.matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let flakes: Flake[] = [];
    let frame = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const seed = (): Flake => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.8 + Math.random() * 2.2,
      drift: -0.3 + Math.random() * 0.6,
      speed: 0.25 + Math.random() * 0.75,
      alpha: 0.25 + Math.random() * 0.5,
    });

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent?.clientWidth ?? window.innerWidth;
      height = parent?.clientHeight ?? window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      flakes = Array.from({ length: count }, seed);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#ffffff";
      for (const f of flakes) {
        f.y += f.speed;
        f.x += f.drift;
        // Recycle off the top so the field never thins out.
        if (f.y - f.r > height) {
          f.y = -f.r;
          f.x = Math.random() * width;
        }
        if (f.x < -f.r) f.x = width + f.r;
        if (f.x > width + f.r) f.x = -f.r;

        ctx.globalAlpha = f.alpha;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none z-[1] ${className}`}
    />
  );
};

export default Snowfall;
