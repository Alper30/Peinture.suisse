import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { clientAreaEnabled } from "./lib/site-config";

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

const withClerk = clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) {
      const segment = req.nextUrl.pathname.split("/")[1];
      const locale = routing.locales.includes(
        segment as (typeof routing.locales)[number],
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
  /**
   * CSP burada ÜRETİLMEZ — next.config.ts'de statik olarak tanımlıdır.
   *
   * Clerk'in `contentSecurityPolicy` seçeneği katı modda her istekte yeni bir
   * nonce üretir. Nonce ise Next.js'te YALNIZCA dinamik render edilen
   * sayfalarda script etiketlerine işlenebilir (bkz. Next 16 dokümanı,
   * 01-app/02-guides/content-security-policy.md). Bu site statik üretiliyor,
   * dolayısıyla HTML'e nonce girmiyor; `strict-dynamic` da `'self'` ve
   * `'unsafe-inline'` izinlerini geçersiz kıldığı için TÜM script'ler
   * bloklanıyordu — site JavaScript'siz kalıyordu.
   */
);

/**
 * Müşteri alanı kapalıyken Clerk hiç devreye girmiyor: her istekte oturum
 * çerezi okumak, gerekirse handshake yönlendirmesi yapmak — hepsi korunacak
 * bir şey olmadığı için boşuna iş. Geriye yalnızca dil yönlendirmesi kalıyor.
 *
 * Bayrak açıldığında koruma aynen geri gelir. Bkz. lib/site-config.ts
 */
export default clientAreaEnabled ? withClerk : handleI18n;

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
