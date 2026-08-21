import { siteConfig } from "@/lib/site-config";
import { jsonLd } from "@/lib/json-ld";

/**
 * Yerel SEO için schema.org HousePainter (LocalBusiness) yapılandırılmış verisi.
 * Google, "peintre Lausanne" gibi aramalarda işletme kartı için bunu okur.
 */
export function JsonLd({ locale }: { locale: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "HousePainter",
    name: siteConfig.name,
    url: `${siteConfig.baseUrl}/${locale}`,
    telephone: siteConfig.phoneDisplay,
    // Boş bir `email` alanı Google'a yanlış sinyal verir — adres yoksa hiç yazma
    ...(siteConfig.email ? { email: siteConfig.email } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.addressLocality,
      postalCode: siteConfig.address.postalCode,
      addressRegion: siteConfig.address.addressRegion,
      addressCountry: siteConfig.address.addressCountry,
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: siteConfig.serviceRegion },
      ...siteConfig.serviceAreas.map((name) => ({
        "@type": "City",
        name,
      })),
    ],
    sameAs: [siteConfig.social.instagram, siteConfig.social.tiktok],
    priceRange: "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(data) }}
    />
  );
}
