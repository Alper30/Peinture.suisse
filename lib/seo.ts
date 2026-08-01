import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";

/**
 * Bir sayfa için hreflang alternates üretir.
 * href, locale'siz iç yol olmalı (örn. "/services").
 */
export function localeAlternates(href: string) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = getPathname({ locale, href });
  }
  languages["x-default"] = getPathname({
    locale: routing.defaultLocale,
    href,
  });
  return {
    canonical: getPathname({ locale: routing.defaultLocale, href }),
    languages,
  };
}
