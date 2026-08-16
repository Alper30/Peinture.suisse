/**
 * Hero'nun boya döngüsü — « le mur qui se peint ».
 *
 * Her sahne bir işi anlatır: solda başlayan bir rulo geçişi, ham/işlem halindeki
 * yüzeyi siler ve bitmiş mekânı açar.
 *
 * RENKLER UYDURULMADI. Her `swatch` değeri ilgili fotoğrafın duvar bölgesinden
 * doğrudan örneklendi (ImageMagick, %20'lik bölge ortalaması). Bilerek bir
 * ticari renk kodu (NCS / RAL) yazmıyoruz: bu fotoğrafların gerçek ürün
 * referansı bilinmiyor ve olmayan bir referansı siteye yazmak yanlış beyandır.
 * Gerçek referanslar geldiğinde buraya bir `code` alanı eklenip etikette
 * gösterilebilir.
 */
export type PaintScene = {
  /** messages/*.json → home.hero.scenes.<id> */
  id: "salon" | "boheme" | "sauge" | "facade";
  /** işin devam ettiği hâl — üstte durur, rulo geçtikçe silinir */
  before: string;
  /** bitmiş hâl — altta durur, rulo geçtikçe açılır */
  after: string;
  /** fotoğraftan örneklenmiş duvar rengi; ıslak kenar bu renkte parlar */
  swatch: string;
};

export const paintScenes: PaintScene[] = [
  {
    id: "salon",
    before: "/images/hero-chantier-avant.jpg",
    after: "/images/hero-salon-apres.jpg",
    swatch: "#DCD8D0",
  },
  {
    id: "boheme",
    before: "/images/platre-lissage.jpg",
    after: "/images/int-boheme.jpg",
    swatch: "#D9D2C6",
  },
  {
    id: "sauge",
    before: "/images/rouleau.jpg",
    after: "/images/int-sauge.jpg",
    swatch: "#605A43",
  },
  {
    id: "facade",
    before: "/images/crepi-texture.jpg",
    after: "/images/facade-crepi.jpg",
    swatch: "#CCB592",
  },
];

/**
 * Zamanlama — globals.css'teki `--paint-delay` / `--paint-wipe` ile AYNI olmalı.
 * Tek kaynak burası: CSS değerleri hero bileşeninde inline custom property
 * olarak basılır, böylece ikisi ayrışamaz.
 */
export const PAINT_DELAY_MS = 250;
export const PAINT_WIPE_MS = 1400;
export const PAINT_HOLD_MS = 4800;

/** Bir sahnenin toplam ömrü: geçiş başlamadan önceki bekleme + geçiş + duruş */
export const PAINT_CYCLE_MS = PAINT_DELAY_MS + PAINT_WIPE_MS + PAINT_HOLD_MS;
