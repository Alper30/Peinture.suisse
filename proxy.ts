import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Next 16'da `middleware` konvansiyonu `proxy` olarak yeniden adlandırıldı.
 * Burada İKİ sorumluluk birleşiyor:
 *   1. Clerk — korumalı rotalara giriş zorunluluğu
 *   2. next-intl — dil algılama ve /fr, /de, /en yönlendirmesi
 * Sıra önemli: önce kimlik kontrolü, sonra dil yönlendirmesi.
 */
const handleI18n = createIntlMiddleware(routing);

// Müşteri alanı ve alt sayfaları giriş ister (tüm diller)
const isProtectedRoute = createRouteMatcher([
  "/:locale/espace-client(.*)",
  "/espace-client(.*)",
]);

export default clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) {
      const segment = req.nextUrl.pathname.split("/")[1];
      const locale = routing.locales.includes(
        segment as (typeof routing.locales)[number]
      )
        ? segment
        : routing.defaultLocale;

      // Giriş yapılmamışsa kullanıcının kendi dilindeki giriş sayfasına gönder
      await auth.protect({
        unauthenticatedUrl: new URL(`/${locale}/connexion`, req.url).toString(),
      });
    }

    return handleI18n(req);
  },
  {
    /**
     * CSP'yi Clerk üretir: kendi alan adlarını (FAPI, bot koruması, avatar CDN)
     * kendisi ekler — elle yazılan liste sürüm değişiminde sessizce bozulur.
     * Aşağıdaki direktifler bizim eklediklerimiz, Clerk'inkilerle BİRLEŞTİRİLİR.
     * Not: next.config.ts'de CSP tanımlanmaz, çift başlık çakışması olmasın.
     */
    contentSecurityPolicy: {
      /**
       * Katı mod: her istek için benzersiz nonce üretir ve `strict-dynamic`
       * uygular. Varsayılan mod `script-src`'ye `https: http:` eklediği için
       * neredeyse her kaynağa izin verirdi — bu, korumayı anlamsızlaştırır.
       */
      strict: true,
      directives: {
        "default-src": ["'self'"],
        "img-src": ["'self'", "data:", "blob:"],
        "font-src": ["'self'", "data:"],
        // Siteyi iframe'e gömüp tıklama kaçırmayı engeller
        "frame-ancestors": ["'none'"],
        // Form verisi yalnızca kendi sunucumuza gidebilir
        "form-action": ["'self'"],
        "base-uri": ["'self'"],
        "object-src": ["'none'"],
        "upgrade-insecure-requests": [],
      },
    },
  }
);

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
