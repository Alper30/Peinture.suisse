/**
 * Yasal metinlerin "son güncelleme" tarihini kullanıcının diline göre yazar.
 * 2026-08-02 → "2 août 2026" / "2. August 2026" / "2 August 2026"
 *
 * `T00:00:00Z` ekleniyor: tarih-yalnız ISO dizesi UTC kabul edilir, ancak
 * sunucunun saat dilimi UTC'nin gerisindeyse (ör. Amerika) bir gün kayabilir.
 * Biçimlendirmeyi de UTC'de yaparak her ortamda aynı sonucu garanti ediyoruz.
 */
export function formatLegalDate(isoDate: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
