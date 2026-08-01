"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Link } from "@/i18n/navigation";

type ImageBandProps = {
  src: string;
  alt: string;
  quote: string;
  /** Verilmezse bant salt görsel/alıntı olarak kalır (sayfada CTA tekrarını önler). */
  ctaLabel?: string;
};

/** Bölümler arasında nefes aldıran, paralaks kayan tam genişlik görsel bandı. */
export function ImageBand({ src, alt, quote, ctaLabel }: ImageBandProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[420px] items-center justify-center overflow-hidden py-24 md:min-h-[65vh]"
    >
      <motion.div
        aria-hidden
        style={{ y: reduce ? 0 : y }}
        className="absolute -inset-y-[12%] inset-x-0"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-ink/50" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <p className="font-display text-3xl italic leading-snug text-white md:text-5xl">
          « {quote} »
        </p>
        {ctaLabel && (
          <Link
            href="/contact"
            className="mt-9 inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-base font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/10 active:scale-[0.98]"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
