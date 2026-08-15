/**
 * Merkezi site yapılandırması.
 * [PLACEHOLDER] işaretli alanlar gerçek bilgilerle değiştirilecek.
 */
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const siteConfig = {
  name: "Peinture Suisse",
  baseUrl,

  phoneDisplay: "+41 76 203 63 53",
  phoneHref: "tel:+41762036353",
  // WhatsApp: 077 944 85 56 (uluslararası format, + işareti olmadan)
  whatsappNumber: "41779448556",
  // Aynı numaranın okunabilir hâli — yasal sayfalarda gösterilir
  whatsappDisplay: "+41 77 944 85 56",
  /**
   * E-posta adresi — posta kutusu GERÇEKTEN kurulana kadar BOŞ.
   *
   * Buraya çalışmayan bir adres yazmak gerçek bir sorundu: yasal sayfalar
   * "haklarınızı bu adresten kullanın" diyor, müşteri yazıyor, mesaj hiçbir
   * yere ulaşmıyor. Adres olmadığında telefon + WhatsApp + iletişim formu
   * zaten çalışıyor; e-posta satırları da hiç render edilmiyor.
   *
   * DİKKAT: peinture-suisse.ch BİZE AİT DEĞİL — aynı sektörde faal, ayrı bir
   * İsviçre işletmesine ait. Bizim alan adımız peinture-suisse-romande.ch.
   * Örnek/şablon adres yazarken bile o alan adını kullanmayın.
   *
   * Doldurduğunuzda hiçbir şey değiştirmenize gerek yok — tüm kullanım
   * yerleri (footer, iletişim, espace client, JSON-LD, yasal sayfalar)
   * kendiliğinden geri gelir. Örn: contact@peinture-suisse-romande.ch
   */
  // `as string`: nesne `as const` olduğu için aksi halde tip `""` sabitine
  // daralır ve "adres var mı?" kontrolleri derleyicide ölü koda dönerdi.
  email: "" as string,

  address: {
    // [PLACEHOLDER] — sokak adresi gelince güncelle
    streetAddress: "",
    addressLocality: "Lausanne",
    postalCode: "1000",
    addressRegion: "VD",
    addressCountry: "CH",
  },

  // Tüm Suisse romande'da hizmet veriliyor; merkez Lausanne
  serviceRegion: "Suisse romande",
  serviceAreas: [
    "Lausanne",
    "Genève",
    "Montreux",
    "Vevey",
    "Nyon",
    "Morges",
    "Yverdon-les-Bains",
    "Fribourg",
    "Neuchâtel",
    "Sion",
    "Renens",
    "Bulle",
  ],

  social: {
    instagram: "https://www.instagram.com/peinture_suissee/",
    tiktok: "https://www.tiktok.com/@peinture.suisse",
  },
} as const;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
