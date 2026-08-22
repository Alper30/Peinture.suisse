"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { hasProcessMedia, processMedia } from "@/lib/process-media";

const STEPS = [1, 2, 3] as const;

/**
 * Scroll'a bağlı süreç anlatımı: bölüm boyunca kaydırdıkça
 * dikey boya şeridi dolar ve adımlar sırayla aktifleşir.
 * Mobil ve prefers-reduced-motion'da statik listeye düşer.
 */
export function ScrollProcess() {
  const reduce = useReducedMotion();
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setInteractive(mq.matches && !reduce);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduce]);

  return interactive ? <ScrollyVersion /> : <StaticVersion />;
}

function Heading() {
  const t = useTranslations("home.process");
  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        <span className="inline-block h-px w-6 bg-accent" aria-hidden />
        {t("eyebrow")}
      </p>
      <h2 className="font-display text-4xl leading-[1.08] tracking-tight text-ink md:text-5xl">
        {t("title")}
      </h2>
    </div>
  );
}

function StaticVersion() {
  const t = useTranslations("home.process");
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <Heading />
      <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
        {STEPS.map((n) => (
          <div key={n} className="relative">
            <StepImage step={n} className="mb-6 aspect-[4/3] w-full" />
            <p aria-hidden className="font-display text-6xl italic text-accent/20">
              0{n}
            </p>
            <h3 className="mt-2 font-display text-2xl tracking-tight text-ink">
              {t(`step${n}Title`)}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {t(`step${n}Text`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ScrollyVersion() {
  const t = useTranslations("home.process");
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  useMotionValueEvent(progress, "change", (v) => {
    setActive(Math.min(2, Math.floor(v * 3)));
  });

  const fillScale = useTransform(progress, [0.05, 0.95], [0, 1]);
  const rollerPct = useTransform(progress, [0.05, 0.95], [0, 100]);
  const rollerTop = useMotionTemplate`clamp(0%, ${rollerPct}%, 100%)`;

  return (
    <section ref={sectionRef} className="relative h-[280vh]">
      <div className="sticky top-0 flex min-h-dvh items-center">
        <div className={`mx-auto grid w-full max-w-6xl items-center gap-14 px-5 md:px-8 ${hasProcessMedia ? "grid-cols-[5rem_1fr] xl:grid-cols-[5rem_1fr_22rem]" : "grid-cols-[5rem_1fr]"}`}>
          {/* Boyanan şerit */}
          <div className="relative h-[62vh]" aria-hidden>
            <div className="absolute inset-x-0 top-0 h-full overflow-hidden rounded-full bg-line">
              <motion.div
                className="h-full w-full origin-top rounded-full bg-accent"
                style={{ scaleY: fillScale }}
              />
            </div>
            {/* rulo başı: boya kenarını takip eder */}
            <motion.div
              className="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ top: rollerTop }}
            >
              <div className="h-7 w-16 rounded-lg border-4 border-white bg-accent shadow-lift" />
            </motion.div>
          </div>

          {/* İçerik */}
          <div>
            <Heading />
            <div className="mt-12 space-y-9">
              {STEPS.map((n, i) => {
                const isActive = active === i;
                return (
                  <motion.div
                    key={n}
                    animate={{
                      opacity: isActive ? 1 : 0.32,
                      x: isActive ? 0 : -6,
                    }}
                    transition={{ type: "spring", stiffness: 120, damping: 22 }}
                    className="grid grid-cols-[4.5rem_1fr] items-start gap-5"
                  >
                    <p
                      aria-hidden
                      className={`font-display text-5xl italic transition-colors duration-300 ${
                        isActive ? "text-accent" : "text-accent/25"
                      }`}
                    >
                      0{n}
                    </p>
                    <div>
                      <h3 className="font-display text-2xl tracking-tight text-ink md:text-3xl">
                        {t(`step${n}Title`)}
                      </h3>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted md:text-base">
                        {t(`step${n}Text`)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Adım görseli — `active` ile çapraz geçer. Yalnızca xl'de:
              daha dar ekranda üçüncü sütun metni sıkıştırırdı. */}
          {hasProcessMedia && (
            <div className="relative hidden aspect-[4/3] w-full overflow-hidden rounded-3xl xl:block">
              {STEPS.map((n, i) => (
                <StepImage
                  key={n}
                  step={n}
                  className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                    active === i ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Bir adımın görseli. Yapılandırılmamışsa HİÇBİR ŞEY render etmez —
 * boş çerçeve ya da yer tutucu göstermek, eksikliği kusur gibi gösterirdi.
 */
function StepImage({
  step,
  className = "",
}: {
  step: 1 | 2 | 3;
  className?: string;
}) {
  const media = processMedia[step];
  if (!media.src) return null;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-line ${className}`}>
      <Image
        src={media.src}
        alt={media.alt ?? ""}
        fill
        loading="lazy"
        quality={75}
        sizes="(min-width: 1280px) 22rem, (min-width: 768px) 30vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}
