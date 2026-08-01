"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { services } from "@/lib/services";
import { serviceIcons, ArrowRightIcon } from "@/components/icons";

/**
 * 21st.dev "profile-card-testimonial-carousel" deseninden uyarlandı:
 * büyük görsel + üstüne bindirmeli kart + ok/nokta navigasyonu.
 * İçerik: hizmetlerimiz (görsel, başlık, açıklama, hizmet sayfası linki).
 */
const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4, ease: "easeInOut" },
} as const;

export function ServicesCarousel({ className }: { className?: string }) {
  const t = useTranslations("services.items");
  const tc = useTranslations("common");
  const tn = useTranslations("home.carousel");
  const reduce = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Otomatik geçiş: 6 sn'de bir; hover'da ve reduced-motion'da durur
  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(
      () => setCurrentIndex((i) => (i + 1) % services.length),
      6000
    );
    return () => clearInterval(id);
  }, [reduce, paused]);

  const service = services[currentIndex];
  const Icon = serviceIcons[service.icon];
  const title = t(`${service.key}.title`);

  const handleNext = () =>
    setCurrentIndex((i) => (i + 1) % services.length);
  const handlePrevious = () =>
    setCurrentIndex((i) => (i - 1 + services.length) % services.length);

  const card = (
    <AnimatePresence mode="wait">
      <motion.div key={service.slug} {...fade}>
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Icon className="h-6 w-6" />
        </span>
        <h3 className="mt-5 font-display text-3xl tracking-tight text-ink md:text-4xl">
          {title}
        </h3>
        <p className="mt-3 text-base font-medium leading-relaxed text-ink/85">
          {t(`${service.key}.short`)}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
          {t(`${service.key}.intro`)}
        </p>
        <Link
          href={`/services/${service.slug}`}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white shadow-card transition-all duration-300 hover:bg-accent-deep hover:shadow-lift active:scale-[0.98]"
        >
          {tc("readMore")}
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div
      className={cn("w-full", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Masaüstü: görsel + bindirmeli kart */}
      <div className="relative hidden items-center md:flex">
        <div className="relative aspect-[4/3] w-[54%] shrink-0 overflow-hidden rounded-3xl shadow-lift">
          <AnimatePresence mode="wait">
            <motion.div key={service.image} {...fade} className="absolute inset-0">
              <Image
                src={service.image}
                alt={title}
                fill
                sizes="(max-width: 1280px) 55vw, 640px"
                className="object-cover"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="z-10 -ml-20 flex-1 rounded-3xl border border-line bg-surface p-8 shadow-lift lg:p-10">
          {card}
        </div>
      </div>

      {/* Mobil: üst üste */}
      <div className="md:hidden">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift">
          <AnimatePresence mode="wait">
            <motion.div key={service.image} {...fade} className="absolute inset-0">
              <Image
                src={service.image}
                alt={title}
                fill
                sizes="100vw"
                className="object-cover"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="-mt-10 mx-4 rounded-3xl border border-line bg-surface p-6 shadow-lift">
          {card}
        </div>
      </div>

      {/* Alt navigasyon */}
      <div className="mt-9 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={handlePrevious}
          aria-label={tn("prev")}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-line bg-surface shadow-card transition-all duration-200 hover:border-ink/30 hover:shadow-lift active:scale-95"
        >
          <ChevronLeft className="h-5 w-5 text-ink" />
        </button>

        <div className="flex items-center gap-2">
          {services.map((s, i) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => setCurrentIndex(i)}
              aria-label={tn("goTo", { n: i + 1 })}
              aria-current={i === currentIndex ? "true" : undefined}
              className={cn(
                "h-2.5 cursor-pointer rounded-full transition-all duration-300",
                i === currentIndex
                  ? "w-7 bg-accent"
                  : "w-2.5 bg-line hover:bg-muted/50"
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label={tn("next")}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-line bg-surface shadow-card transition-all duration-200 hover:border-ink/30 hover:shadow-lift active:scale-95"
        >
          <ChevronRight className="h-5 w-5 text-ink" />
        </button>
      </div>
    </div>
  );
}
