/**
 * « Comment ça se passe » bölümünün adım görselleri.
 *
 * Boş bırakılan adım GÖRSELSİZ render edilir — bölüm bugünkü haliyle
 * çalışmaya devam eder. Yer tutucu fotoğraf koymuyoruz: sitedeki 14 karenin
 * hepsi başka bir yerde kullanılıyor ve aynı fotoğrafı tek sayfada üçüncü kez
 * göstermek, adımların birbirinden ayrıştığı izlenimini bozar.
 *
 * ⚠️ ÇEKİLMESİ GEREKEN ÜÇ KARE — her biri kendi adımının ARTEFAKTINI göstermeli,
 * genel bir "güzel iç mekân" değil:
 *
 *   1. Contact & visite — şantiyenin bulunduğu hâli. Metre, el feneri ya da
 *      duvara dayanmış bir not defteri; tercihen bir el kadraja giriyor.
 *      Amaç: "geliyoruz, bakıyoruz" duygusu. Yatay, doğal ışık.
 *
 *   2. Devis détaillé — teklif anının nesnesi: nuancier (renk yelpazesi),
 *      üzerine not alınmış ölçü kâğıdı, kalem. Gerçek bir müşteri devis'i
 *      FOTOĞRAFLANMAMALI (kişisel veri); boş form ya da renk kartı yeterli.
 *
 *   3. Exécution soignée — işin titizliği: maskeleme bandıyla çıkarılmış
 *      keskin kenar, yere serilmiş örtü, temiz bırakılmış oda. Ruloyla
 *      çalışan genel bir kare DEĞİL — o zaten ana sayfada iki kez var.
 *
 * Dosyaları `public/images/` altına koyup yolları buraya yazmak yeterli.
 * En-boy oranı 4:3'e yakın olsun; bileşen `object-cover` ile kırpıyor.
 */
export type ProcessStepMedia = {
  /** `/images/...` — boşsa o adım görselsiz render edilir */
  src?: string;
  /** Ekran okuyucu için: karede NE görünüyor (adım başlığını tekrarlama) */
  alt?: string;
};

export const processMedia: Record<1 | 2 | 3, ProcessStepMedia> = {
  1: {},
  2: {},
  3: {},
};

/** Herhangi bir adımda görsel var mı? Masaüstü panelini buna göre açıyoruz. */
export const hasProcessMedia = Object.values(processMedia).some((m) => m.src);
