import type { NextConfig } from "next";
import { clientAreaEnabled } from "./lib/site-config";
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
    const host = Buffer.from(encoded, "base64")
      .toString("utf8")
      .replace(/\$$/, "");
    return /^[a-z0-9.-]+$/i.test(host) ? host : null;
  } catch {
    return null;
  }
}

const clerkHost = clerkFrontendApiHost();
/**
 * Müşteri alanı kapalıyken Clerk'e CSP'de HİÇ izin verilmiyor.
 *
 * Kapalı durumda Clerk'in tarayıcı paketi zaten yüklenmiyor
 * (bkz. app/[locale]/layout.tsx), ama izin listesi kalırsa üçüncü parti bir
 * origin'e boş yere script çalıştırma hakkı tanımış oluruz. İzin verilen her
 * host, o host ele geçirildiğinde bizim sayfamızda kod çalıştırabilir demektir.
 * Kullanılmayan izin, taşınmayacak risktir.
 *
 * Key okunamazsa (yalnızca müşteri alanı AÇIKKEN önemli) Clerk'in genel alan
 * adlarına düşülüyor ki kimlik akışı sessizce çökmesin. Bunlar çok kiracılı
 * joker alan adları — dar olan tek host'a göre gevşektir, bu yüzden `.env`'de
 * anahtarın tanımlı olması önemli.
 */
const clerkOrigins = !clientAreaEnabled
  ? []
  : clerkHost
    ? [`https://${clerkHost}`]
    : ["https://*.clerk.accounts.dev", "https://*.clerk.com"];

/** Boş parçaları eleyip birleştirir: kapalı özellikler CSP'de iz bırakmasın */
const src = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(" ");

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
  src(
    `script-src 'self' 'unsafe-inline'`,
    ...clerkOrigins,
    // Clerk'in bot koruması (Turnstile) — yalnızca kimlik akışıyla birlikte
    clientAreaEnabled && "https://challenges.cloudflare.com",
    isDev && "'unsafe-eval'",
  ),
  `style-src 'self' 'unsafe-inline'`,
  // img.clerk.com: kullanıcı avatarları
  src(
    `img-src 'self' data: blob:`,
    clientAreaEnabled && "https://img.clerk.com",
  ),
  `font-src 'self' data:`,
  src(
    `connect-src 'self'`,
    ...clerkOrigins,
    clientAreaEnabled && "https://clerk-telemetry.com",
    clientAreaEnabled && "https://*.clerk-telemetry.com",
    isDev && "ws: wss:",
  ),
  src(
    `frame-src 'self'`,
    ...clerkOrigins,
    clientAreaEnabled && "https://challenges.cloudflare.com",
  ),
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
