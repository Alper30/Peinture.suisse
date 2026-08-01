import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/**
 * Güvenlik başlıkları — tüm yollara uygulanır.
 *
 * Not: script-src'de 'unsafe-inline'/'unsafe-eval' bulunuyor çünkü Next.js
 * hidrasyon betiklerini satır içi yazar. Yine de saldırganın DIŞ bir alan
 * adından betik yüklemesini engeller. Nonce tabanlı katı CSP'ye geçmek
 * proxy.ts'de nonce üretimi gerektirir — ileride yapılabilir.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  // Siteyi başka bir sayfaya iframe ile gömüp tıklama kaçırmayı engeller
  "frame-ancestors 'none'",
  // Formlar yalnızca kendi sunucumuza gönderilebilir
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
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
