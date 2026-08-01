"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { whatsappLink } from "@/lib/site-config";
import { WhatsAppIcon } from "@/components/icons";

const rise = [0.22, 1, 0.36, 1] as const;

/** Kelime kelime maskeli yükselme efekti. */
function MaskedWords({
  text,
  delay,
  stagger = 0.055,
}: {
  text: string;
  delay: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-top"
        >
          <motion.span
            className="inline-block"
            initial={{ y: reduce ? 0 : "112%" }}
            animate={{ y: 0 }}
            transition={{ delay: delay + i * stagger, duration: 0.75, ease: rise }}
          >
            {word}
          </motion.span>
          {" "}
        </span>
      ))}
    </>
  );
}

/**
 * Sinematik hero: paralaks fotoğraf, maskeli kelime animasyonları,
 * kendini çizen fırça vurgusu ve scroll işareti.
 * İlk ziyarette IntroCurtain ~1.3 sn'de kalktığı için animasyonlar ona senkron başlar.
 */
export function Hero() {
  const t = useTranslations("home.hero");
  const tc = useTranslations("common");
  const reduce = useReducedMotion();

  // Açılış perdesi bu oturumda oynayacaksa metinler perde kalkarken belirsin
  const firstVisit =
    typeof window !== "undefined" && !sessionStorage.getItem("ps-intro");
  const base = reduce ? 0 : firstVisit ? 1.35 : 0.1;

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], [0, 160]);
  const bgScale = useTransform(scrollY, [0, 800], [1.04, 1.16]);

  return (
    <section className="relative flex min-h-[92svh] items-end overflow-hidden">
      {/* Paralaks arka plan fotoğrafı */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        initial={{ scale: reduce ? 1.04 : 1.14 }}
        animate={{ scale: 1.04 }}
        transition={{ delay: base, duration: 1.6, ease: rise }}
        style={reduce ? undefined : { y: bgY, scale: bgScale }}
      >
        <Image
          src="/images/hero-peintre-v2.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Okunabilirlik için degrade katmanları */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/15"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-transparent"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24 pt-40 md:px-8 md:pb-32">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: base + 0.05, duration: 0.6, ease: rise }}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/85"
        >
          <span className="inline-block h-px w-6 bg-accent" aria-hidden />
          {t("eyebrow")}
        </motion.p>

        <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.06] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="block">
            <MaskedWords text={t("titleLine1")} delay={base + 0.15} />
          </span>
          <span className="relative inline-block italic text-white/90">
            <MaskedWords text={t("titleLine2")} delay={base + 0.38} />
            {/* Kendini çizen fırça vurgusu */}
            <motion.svg
              viewBox="0 0 300 20"
              preserveAspectRatio="none"
              className="absolute -bottom-3 left-0 h-4 w-full"
              aria-hidden
            >
              <motion.path
                d="M5 12 C 60 6, 110 16, 165 11 S 260 8, 295 12"
                fill="none"
                stroke="#C03428"
                strokeWidth={6}
                strokeLinecap="round"
                initial={{ pathLength: reduce ? 1 : 0, opacity: 0.9 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: base + 0.95, duration: 0.7, ease: "easeInOut" }}
              />
            </motion.svg>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: base + 0.6, duration: 0.65, ease: rise }}
          className="mt-7 max-w-xl text-lg leading-relaxed text-white/80"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: base + 0.75, duration: 0.65, ease: rise }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-base font-medium text-white shadow-lift transition-all duration-300 hover:bg-accent-deep active:scale-[0.98]"
          >
            {tc("devisCta")}
          </Link>
          <a
            href={whatsappLink(tc("whatsappPrefill"))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 px-7 py-3.5 text-base font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/10 active:scale-[0.98]"
          >
            <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
            {tc("whatsappCta")}
          </a>
        </motion.div>
      </div>

      {/* Scroll işareti */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: base + 1.5, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2.5 md:flex"
        aria-hidden
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/60">
          {t("scrollCue")}
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-white/20">
          {!reduce && (
            <motion.span
              className="absolute left-0 top-0 block h-4 w-px bg-white/90"
              animate={{ y: [-18, 46] }}
              transition={{
                repeat: Infinity,
                duration: 1.7,
                ease: "easeInOut",
                repeatDelay: 0.4,
              }}
            />
          )}
        </span>
      </motion.div>
    </section>
  );
}
