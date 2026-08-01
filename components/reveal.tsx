"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

/**
 * Scroll'da yumuşak beliren sarmalayıcı.
 * Performans: framer-motion yerine IntersectionObserver + CSS transition —
 * bu bileşen 28 yerde kullanıldığı için animasyon kütüphanesini
 * neredeyse tüm sayfalara taşıyordu.
 *
 * SSR'da içerik görünür gelir (JS çalışmasa bile kaybolmaz); hydration'dan
 * sonra yalnızca ekranın altında kalan bloklar gizlenip görünürken animasyonla gelir.
 */
export function Reveal({ children, delay = 0, y = 28, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("shown");
      return;
    }

    // Güvenlik ağı: ölçüm yapılamayan ortamlarda (0 yükseklikli görüntü alanı,
    // IntersectionObserver desteklenmiyor) içerik ASLA görünmez kalmamalı.
    if (
      typeof IntersectionObserver === "undefined" ||
      window.innerHeight === 0
    ) {
      setState("shown");
      return;
    }

    // Görüş alanındaysa animasyonsuz bırak (yukarıdan aşağı zıplama olmasın)
    if (el.getBoundingClientRect().top < window.innerHeight - 80) {
      setState("shown");
      return;
    }

    setState("hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -80px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={
        state === "idle"
          ? undefined
          : {
              opacity: state === "shown" ? 1 : 0,
              transform: state === "shown" ? "none" : `translateY(${y}px)`,
              transition: `opacity .7s cubic-bezier(.22,1,.36,1) ${delay}s, transform .7s cubic-bezier(.22,1,.36,1) ${delay}s`,
              willChange: state === "hidden" ? "opacity, transform" : undefined,
            }
      }
    >
      {children}
    </div>
  );
}
