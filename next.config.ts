import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const isDev = process.env.NODE_ENV === "development";

/**
 * Clerk'in Frontend API alan adı, publishable key'in içine gömülüdür:
 *   pk_test_<base64("<fapi-host>$")>
 * Elle yazmak yerine çözüyoruz — dev/prod örneği değiştiğinde CSP kendiliğinden
 * doğru host'u gösterir. (Publishable key gizli değildir, zaten tarayıcıya gider.)
 */
function clerkFrontendApiHost(): string | null {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const encoded = pk?.split("_")[2];
  if (!encoded) return null;
  try {
    const host = Buffer.from(encoded, "base64").toString("utf8").replace(/\$$/, "");
    return /^[a-z0-9.-]+$/i.test(host) ? host : null;
  } catch {
    return null;
  }
}

const clerkHost = clerkFrontendApiHost();
// Key okunamazsa kimlik akışı çökmesin diye Clerk'in genel alan adlarına düş
const clerkOrigins = clerkHost
  ? [`https://${clerkHost}`]
  : ["https://*.clerk.accounts.dev", "https://*.clerk.com"];

/**
 * Content-Security-Policy — statik.
 *
 * nonce + `strict-dynamic` KULLANILMIYOR: nonce yalnızca dinamik render edilen
 * sayfalarda script etiketlerine işlenebilir; bu site statik üretiliyor.
 * İkisi birleşince tarayıcı tüm script'leri bloklar (bir kez yaşandı).
 * Bu yüzden script-src'de `'unsafe-inline'` var — Next.js App Router RSC
 * verisini satır içi script'lerle akıttığı için nonce'suz kurulumda zorunlu.
 * Karşılığında hiçbir joker (`https:`) yok: yalnızca kendi origin'imiz + Clerk.
 */
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' ${clerkOrigins.join(" ")} https://challenges.cloudflare.com${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https://img.clerk.com`,
  `font-src 'self' data:`,
  `connect-src 'self' ${clerkOrigins.join(" ")} https://clerk-telemetry.com https://*.clerk-telemetry.com${isDev ? " ws: wss:" : ""}`,
  // Clerk'in bot koruması (Turnstile) ve kimlik akışı iframe'leri
  `frame-src 'self' ${clerkOrigins.join(" ")} https://challenges.cloudflare.com`,
  `worker-src 'self' blob:`,
  // Siteyi iframe'e gömüp tıklama kaçırmayı engeller
  `frame-ancestors 'none'`,
  // Form verisi yalnızca kendi sunucumuza gidebilir
  `form-action 'self'`,
  `base-uri 'self'`,
  `object-src 'none'`,
  `upgrade-insecure-requests`,
].join("; ");

/** Güvenlik başlıkları — tüm yollara uygulanır. */
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
