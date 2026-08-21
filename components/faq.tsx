import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "./reveal";
import { ArrowRightIcon } from "./icons";
import { jsonLd } from "@/lib/json-ld";

const KEYS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

/**
 * SSS bölümü — native <details> üzerine kurulu: sıfır JavaScript,
 * klavye ve ekran okuyucu desteği tarayıcıdan gelir.
 * Açılma animasyonu CSS grid (0fr → 1fr) hilesiyle yapılır.
 */
export async function Faq() {
  const t = await getTranslations("faq");
  const tc = await getTranslations("common");

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        {/* Sol sütun: başlık — masaüstünde okurken sabit kalır */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              <span className="inline-block h-px w-6 bg-accent" aria-hidden />
              {t("eyebrow")}
            </p>
            <h2 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight text-ink md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted">
              {t("subtitle")}
            </p>
            <Link
              href="/contact"
              className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-deep"
            >
              {tc("devisCta")}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        {/* Sağ sütun: sorular */}
        <div className="border-t border-line">
          {KEYS.map((key, i) => (
            <Reveal key={key} delay={i * 0.04}>
              <details className="faq-item group border-b border-line">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-left">
                  <h3 className="font-display text-xl leading-snug tracking-tight text-ink transition-colors group-hover:text-accent md:text-2xl">
                    {t(`items.${key}.q`)}
                  </h3>
                  <span
                    aria-hidden
                    className="faq-icon mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-accent transition-colors group-hover:border-accent/40"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <path d="M12 5v14" className="faq-icon-bar" />
                      <path d="M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <div className="faq-panel">
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-7 leading-relaxed text-muted md:text-lg">
                      {t(`items.${key}.a`)}
                    </p>
                  </div>
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Google zengin sonuçları için FAQPage yapılandırılmış verisi. */
export async function FaqJsonLd() {
  const t = await getTranslations("faq");

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: KEYS.map((key) => ({
      "@type": "Question",
      name: t(`items.${key}.q`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`items.${key}.a`),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(data) }}
    />
  );
}
