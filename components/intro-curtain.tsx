"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LogoMark } from "./logo";

const wipe = [0.76, 0, 0.24, 1] as const;

/**
 * Açılış perdesi: siteye ilk girişte marka, mürekkep zemin üzerinde belirir,
 * ardından iki katmanlı perde (accent + ink) yukarı sıyrılarak hero'yu açar.
 * Oturum başına bir kez oynar; prefers-reduced-motion'da hiç görünmez.
 */
export function IntroCurtain() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (reduce) return;
    if (sessionStorage.getItem("ps-intro")) return;
    sessionStorage.setItem("ps-intro", "1");
    setActive(true);

    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      document.body.style.overflow = "";
      setActive(false);
    }, 2300);

    return () => {
      document.body.style.overflow = "";
      clearTimeout(timer);
    };
  }, [reduce]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden>
      {/* Arka perde: accent — ink'ten 0.15 sn sonra kalkar, kırmızı iz bırakır */}
      <motion.div
        className="absolute inset-0 bg-accent"
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ delay: 1.42, duration: 0.75, ease: wipe }}
      />

      {/* Ön perde: ink + wordmark */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center bg-ink"
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ delay: 1.25, duration: 0.75, ease: wipe }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <LogoMark tone="light" className="h-24 w-auto sm:h-28" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 font-display text-4xl tracking-tight text-white sm:text-5xl md:text-6xl"
        >
          Peinture<span className="italic text-accent"> Suisse</span>
        </motion.p>
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.55, duration: 0.6, ease: wipe }}
          className="mt-5 block h-px w-24 origin-left bg-accent"
        />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 text-[11px] font-semibold uppercase tracking-[0.42em] text-white/70"
        >
          Rénovation
        </motion.p>
      </motion.div>
    </div>
  );
}
