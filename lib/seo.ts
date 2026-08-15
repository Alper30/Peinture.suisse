import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";

/**
 * Bir sayfa için canonical + hreflang alternates üretir.
 * href, locale'siz iç yol olmalı (örn. "/services").
 *
 * `currentLocale` ZORUNLU: canonical her dilde KENDİ sayfasını göstermeli.
 * Sabit defaultLocale döndürülürse /de ve /en sayfaları kendilerini Fransızca
 * sayfanın kopyası ilan eder ve Google onları indeksten düşürür — üstelik
 * hemen yanlarındaki hreflang kümesiyle çelişirler.
 * Parametre opsiyonel değil ki atlanan bir çağrı noktası derleme hatası versin,
 * sessizce yanlış canonical üretmesin.
 */
export function localeAlternates(href: string, currentLocale: string) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = getPathname({ locale, href });
  }
  languages["x-default"] = getPathname({
    locale: routing.defaultLocale,
    href,
  });
  return {
    canonical: getPathname({ locale: currentLocale, href }),
    languages,
  };
}
