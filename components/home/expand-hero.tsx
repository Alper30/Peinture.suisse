"use client";

import { useTranslations } from "next-intl";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { Link } from "@/i18n/navigation";
import { whatsappLink } from "@/lib/site-config";
import { WhatsAppIcon } from "@/components/icons";

/**
 * Anasayfa hero'su: scroll-expansion deneyimi.
 * Arka plan = ham şantiye, genişleyen görsel = bitmiş aydınlık salon.
 * Genişleme tamamlanınca alt metin + CTA'lar belirir.
 */
export function ExpandHero() {
  const t = useTranslations("home.hero");
  const tc = useTranslations("common");

  return (
    <ScrollExpandMedia
      bgImageSrc="/images/hero-chantier-avant.jpg"
      mediaSrc="/images/hero-salon-apres.jpg"
      eyebrow={t("eyebrow")}
      titleLine1={t("titleLine1")}
      titleLine2={t("titleLine2")}
      scrollHint={t("scrollCue")}
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-7 text-center">
        <p className="text-lg leading-relaxed text-ink/80">{t("subtitle")}</p>

        <div className="flex flex-wrap items-center justify-center gap-4">
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
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-7 py-3.5 text-base font-medium text-ink transition-all duration-300 hover:border-ink/30 active:scale-[0.98]"
          >
            <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
            {tc("whatsappCta")}
          </a>
        </div>

      </div>
    </ScrollExpandMedia>
  );
}
