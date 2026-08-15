import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { LegalPage, type LegalSection } from "./legal-page";
import { legalConfig } from "@/lib/legal-config";
import { formatLegalDate } from "@/lib/legal-date";
import { localeAlternates } from "@/lib/seo";

/**
 * Dört yasal sayfanın ortak iskeleti. Her sayfa yalnızca hangi çeviri
 * dokümanını (`doc`) ve hangi yolu kullandığını söyler; başlık, tarih,
 * içindekiler ve bölüm render'ı buradan gelir.
 */

/** `messages/legal/*.json` içindeki doküman anahtarları */
export type LegalDocKey =
  | "mentions"
  | "confidentialite"
  | "cookies"
  | "conditions";

export async function legalMetadata(
  doc: LegalDocKey,
  href: string,
  locale: string
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `legal.${doc}.meta` });
  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates(href, locale),
  };
}

export async function LegalDocument({
  doc,
  locale,
  slots,
}: {
  doc: LegalDocKey;
  locale: string;
  slots?: Record<string, ReactNode>;
}) {
  const t = await getTranslations("legal");
  const td = await getTranslations(`legal.${doc}`);

  // `raw` çeviri dosyasındaki diziyi olduğu gibi verir (t() yalnızca string döner)
  const sections = td.raw("sections") as LegalSection[];

  return (
    <LegalPage
      eyebrow={t("eyebrow")}
      title={td("title")}
      updated={t("updatedLabel", {
        date: formatLegalDate(legalConfig.lastUpdated, locale),
      })}
      intro={td("intro")}
      sections={sections}
      slots={slots}
      tocTitle={t("toc")}
    />
  );
}
