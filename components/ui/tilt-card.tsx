"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * 21st.dev tarzı 3D tilt kartı: fare kartın üzerinde gezinirken
 * kart perspektifte eğilir ve parlama (glare) imleci takip eder.
 *
 * Performans: motion value yerine CSS custom property + transition —
 * React render'ı tetiklemez, animasyon kütüphanesi gerektirmez.
 * prefers-reduced-motion CSS tarafında pasifleştirilir (bkz. globals.css).
 */
export function TiltCard({
  children,
  className,
  max = 8,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--tilt-rx", `${-(py - 0.5) * 2 * max}deg`);
    el.style.setProperty("--tilt-ry", `${(px - 0.5) * 2 * max}deg`);
    el.style.setProperty("--tilt-gx", `${px * 100}%`);
    el.style.setProperty("--tilt-gy", `${py * 100}%`);
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-rx", "0deg");
    el.style.setProperty("--tilt-ry", "0deg");
  }

  return (
    <div style={{ perspective: 900 }} className={cn("h-full", className)}>
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="tilt-card relative h-full w-full overflow-hidden rounded-3xl"
      >
        {children}
        <span aria-hidden className="tilt-glare pointer-events-none absolute inset-0" />
      </div>
    </div>
  );
}
