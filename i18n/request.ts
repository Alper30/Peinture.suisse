import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  /**
   * Yasal metinler ayrı dosyada tutulur ve `legal` ad alanı altına eklenir.
   * Gerekçe: mentions légales / confidentialité / cookies / CGV toplamı ana
   * çeviri dosyasının birkaç katı; aynı dosyada arayüz metinlerini bulmayı
   * zorlaştırır ve her sayfa yüklemesinde gereksiz yere taşınır.
   */
  const [ui, legal] = await Promise.all([
    import(`../messages/${locale}.json`),
    import(`../messages/legal/${locale}.json`),
  ]);

  return {
    locale,
    messages: { ...ui.default, legal: legal.default },
  };
});
