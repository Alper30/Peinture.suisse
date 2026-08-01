import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/**
 * Güvenlik başlıkları — tüm yollara uygulanır.
 *
 * Content-Security-Policy burada DEĞİL, proxy.ts içinde Clerk tarafından
 * üretilir: Clerk kendi alan adlarını (FAPI, bot koruması, avatar CDN)
 * otomatik ekler. İki yerde tanımlamak çakışan başlıklara yol açar.
 */
const securityHeaders = [
  // MIME türü tahminini kapatır (yüklenen dosyanın betik gibi çalışmasını önler)
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Kullanmadığımız cihaz izinlerini tamamen kapatır
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Sunucu sürümünü ifşa eden X-Powered-By başlığını kaldırır
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
