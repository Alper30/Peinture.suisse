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
  // [PLACEHOLDER] — gerçek e-posta adresi gelince güncelle
  email: "contact@peinture-suisse.ch",

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
