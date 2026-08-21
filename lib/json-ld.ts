/**
 * JSON-LD'yi `<script>` etiketine gömmek için güvenli biçimde serileştirir.
 *
 * `JSON.stringify` `<`, `>` ve `&` karakterlerini KAÇIRMAZ. Yani veriye
 * `</script>` girerse tarayıcı script etiketini orada kapatır ve sonrasını
 * HTML olarak yorumlar — klasik XSS. Bugün bu üç JSON-LD bloğunu besleyen her
 * değer depoya elle yazılmış içerik (siteConfig sabitleri, çeviri dosyaları,
 * MDX frontmatter), dolayısıyla sömürülebilir bir yol YOK.
 *
 * Yine de kaçış burada yapılıyor: bir gün bu verilerden biri dinamikleşirse
 * (arama parametresi, CMS, kullanıcı içeriği) açık sessizce doğar. Üstelik
 * CSP kurtarmaz — `script-src` içinde `'unsafe-inline'` var (statik render +
 * nonce çelişkisi yüzünden bilinçli, bkz. next.config.ts), yani enjekte edilen
 * satır içi script ÇALIŞIR. Tek satırlık kaçış, sinki tasarım gereği güvenli
 * kılıyor.
 *
 * `<` biçimi seçildi: JSON dizgesi içinde geçerlidir, `JSON.parse` onu
 * yeniden `<` olarak okur, dolayısıyla arama motorlarının gördüğü veri
 * değişmez — yalnızca HTML ayrıştırıcısı için zararsız hale gelir.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
