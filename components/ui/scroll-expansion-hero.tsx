"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollExpandMediaProps {
  mediaSrc: string;
  bgImageSrc: string;
  titleLine1: string;
  titleLine2: string;
  eyebrow?: string;
  scrollHint?: string;
  className?: string;
  children?: ReactNode;
}

/**
 * 21st.dev "scroll-expansion-hero" deseninden uyarlandı.
 * Performans: ilerleme React state yerine motionValue'da tutulur —
 * wheel/touch başına re-render YOK; tüm ölçüler GPU-dostu transform'larla akar.
 * Klavye desteği + prefers-reduced-motion'da statik sürüm.
 */
const ScrollExpandMedia = ({
  mediaSrc,
  bgImageSrc,
  titleLine1,
  titleLine2,
  eyebrow,
  scrollHint,
  className,
  children,
}: ScrollExpandMediaProps) => {
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const progress = useMotionValue(reduce ? 1 : 0);
  const expandedRef = useRef(false);
  const showContentRef = useRef(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduce) {
      progress.set(1);
      expandedRef.current = true;
      setShowContent(true);
      return;
    }

    const applyProgress = (delta: number) => {
      const next = Math.min(Math.max(progress.get() + delta, 0), 1);
      progress.set(next);
      if (next >= 1 && !expandedRef.current) {
        expandedRef.current = true;
      }
      if (next >= 1 && !showContentRef.current) {
        showContentRef.current = true;
        setShowContent(true);
      } else if (next < 0.75 && showContentRef.current) {
        showContentRef.current = false;
        setShowContent(false);
      }
    };

    const handleWheel = (e: globalThis.WheelEvent) => {
      if (expandedRef.current && e.deltaY < 0 && window.scrollY <= 5) {
        expandedRef.current = false;
        e.preventDefault();
      } else if (!expandedRef.current) {
        e.preventDefault();
        applyProgress(e.deltaY * 0.0009);
      }
    };

    const handleTouchStart = (e: globalThis.TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (!touchStartY.current) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchY;

      if (expandedRef.current && deltaY < -20 && window.scrollY <= 5) {
        expandedRef.current = false;
        e.preventDefault();
      } else if (!expandedRef.current) {
        e.preventDefault();
        applyProgress(deltaY * (deltaY < 0 ? 0.008 : 0.005));
        touchStartY.current = touchY;
      }
    };

    const handleTouchEnd = () => {
      touchStartY.current = 0;
    };

    const handleKey = (e: globalThis.KeyboardEvent) => {
      if (expandedRef.current) {
        if ((e.key === "ArrowUp" || e.key === "PageUp") && window.scrollY <= 5) {
          expandedRef.current = false;
          e.preventDefault();
        }
        return;
      }
      if (["ArrowDown", "PageDown", " ", "End"].includes(e.key)) {
        e.preventDefault();
        applyProgress(e.key === "End" ? 1 : 0.28);
      }
      if (["ArrowUp", "PageUp", "Home"].includes(e.key)) {
        e.preventDefault();
        applyProgress(e.key === "Home" ? -1 : -0.28);
      }
    };

    const handleScroll = () => {
      if (!expandedRef.current) window.scrollTo(0, 0);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKey);
    };
  }, [reduce, progress]);

  /**
   * Tüm ölçüler motionValue türevleri — render tetiklemez.
   * Mobilde başlangıç boyutu kasıtlı olarak küçük: kart 95vw ile sınırlı
   * olduğu için 300px'ten başlayınca genişleyecek yer kalmıyordu (efekt
   * görünmez oluyordu) ve başlık tamamen fotoğrafın üstüne düşüyordu.
   */
  const mediaWidth = useTransform(progress, (p) =>
    isMobile ? 190 + p * 520 : 300 + p * 1250
  );
  const mediaHeight = useTransform(progress, (p) =>
    isMobile ? 260 + p * 540 : 400 + p * 400
  );
  const textX = useTransform(progress, (p) => p * (isMobile ? 180 : 150));
  const bgOpacity = useTransform(progress, (p) => 1 - p * 0.85);
  // Durgun halde koyu: başlık fotoğrafın üstünde de okunur kalsın
  const mediaOverlay = useTransform(progress, (p) => 0.62 - p * 0.62);
  const hintOpacity = useTransform(progress, [0, 0.45], [1, 0]);

  const textLeft = useMotionTemplate`translateX(${useTransform(textX, (v) => -v)}vw)`;
  const textRight = useMotionTemplate`translateX(${textX}vw)`;

  return (
    <div className={cn("overflow-x-hidden", className)}>
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-start">
        {/* Arka plan: ham şantiye — genişledikçe kaybolur */}
        <motion.div
          className="absolute inset-0 z-0"
          aria-hidden
          style={{ opacity: bgOpacity }}
        >
          <Image
            src={bgImageSrc}
            alt=""
            fill
            priority
            quality={70}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/45 to-ink/30" />
        </motion.div>

        <div className="relative z-10 flex w-full flex-col items-center">
          <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center">
            {/* Genişleyen medya: bitmiş mekân */}
            <motion.div
              className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl"
              style={{
                width: mediaWidth,
                height: mediaHeight,
                maxWidth: "95vw",
                maxHeight: "85vh",
                boxShadow: "0 24px 80px rgb(20 18 12 / 0.45)",
              }}
            >
              <Image
                src={mediaSrc}
                alt={`${titleLine1} ${titleLine2}`}
                fill
                priority
                quality={72}
                sizes="95vw"
                className="animate-kenburns object-cover"
              />
              <motion.div
                aria-hidden
                className="absolute inset-0 bg-ink"
                style={{ opacity: mediaOverlay }}
              />
            </motion.div>

            {/* Başlık: iki satır, scroll ile iki yana açılır */}
            <div className="pointer-events-none relative z-10 flex w-full flex-col items-center justify-center gap-1 px-4 text-center">
              {eyebrow && (
                <motion.p
                  /* max-w + wrap: uzun eyebrow dar ekranda taşıyordu.
                     Vurgu çizgisi yalnızca tek satıra sığdığı boyutlarda. */
                  className="mb-3 flex max-w-[92vw] flex-wrap items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85 sm:text-[11px] sm:tracking-[0.24em]"
                  style={{ transform: textLeft }}
                >
                  <span
                    className="hidden h-px w-6 bg-accent sm:inline-block"
                    aria-hidden
                  />
                  {eyebrow}
                </motion.p>
              )}
              <h1 className="font-display text-4xl leading-[1.04] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
                <motion.span className="block" style={{ transform: textLeft }}>
                  {titleLine1}
                </motion.span>
                <motion.span
                  className="block italic text-white/90"
                  style={{ transform: textRight }}
                >
                  {titleLine2}
                </motion.span>
              </h1>

              {scrollHint && !reduce && (
                <motion.div
                  className="mt-8 flex flex-col items-center gap-2 text-white/75"
                  style={{ opacity: hintOpacity }}
                >
                  <span className="text-[10px] font-medium uppercase tracking-[0.3em]">
                    {scrollHint}
                  </span>
                  <motion.span
                    aria-hidden
                    className="block h-8 w-px bg-white/40"
                    animate={{ scaleY: [0.4, 1, 0.4] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.6,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              )}
            </div>
          </div>

          {/* Genişleme tamamlanınca beliren içerik */}
          <motion.section
            className="flex w-full flex-col px-6 pb-16 md:px-16"
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 0.7 }}
          >
            {children}
          </motion.section>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
