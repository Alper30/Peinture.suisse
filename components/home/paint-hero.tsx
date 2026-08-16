"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { whatsappLink } from "@/lib/site-config";
import { WhatsAppIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  PAINT_CYCLE_MS,
  PAINT_DELAY_MS,
  PAINT_WIPE_MS,
  paintScenes,
} from "@/lib/nuancier";

/**
 * Anasayfa hero'su — « le mur qui se peint ».
 *
 * Arka planda işin kendisi döner: soldan sağa geçen bir rulo, devam eden işi
 * siler ve bitmiş mekânı açar. Dört sahne sırayla akar.
 *
 * PERFORMANS — üç karar:
 *   1. Kare başına JavaScript YOK. Geçiş tamamen CSS animasyonu (clip-path +
 *      transform); React yalnızca ~6,5 saniyede bir sahne indeksini değiştirir.
 *   2. Görseller kademeli yüklenir. İlk render'da yalnızca 1. sahnenin iki
 *      fotoğrafı vardır (LCP onlara bağlı); sonraki sahne, bir öncekine
 *      geçildiğinde DOM'a girer. Sekiz fotoğraf asla aynı anda inmez.
 *   3. Görünür alandan çıkınca ya da sekme arkaya alınınca döngü DURUR —
 *      arkada boşuna GPU/pil yakmaz.
 *
 * ERİŞİLEBİLİRLİK: fotoğraflar dekoratiftir (alt=""), anlamı taşıyan metin
 * (başlık, renk adı) gerçek metindir. `prefers-reduced-motion` yolunda rulo
 * geçişi hiç çalışmaz — bitmiş mekân doğrudan görünür, sahneler yine değişir.
 */
/** useSyncExternalStore aboneliği — bileşen dışında, kimliği sabit kalsın */
function subscribeToVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

export function PaintHero() {
  const t = useTranslations("home.hero");
  const tc = useTranslations("common");

  const [active, setActive] = useState(0);
  /**
   * DOM'a girmiş en yüksek sahne indeksi — kademeli yükleme (bkz. karar 2).
   * 1'den başlar: ikinci sahne baştan DOM'dadır ama `priority` DEĞİLDİR, yani
   * LCP'den sonra iner ve ilk geçişte yüklenmemiş görsel yanıp sönmez.
   * Yalnızca büyür; sahne döngüsü başa sardığında görseller sökülmez.
   */
  const [loadedUpTo, setLoadedUpTo] = useState(1);
  const [inView, setInView] = useState(true);
  /**
   * Sekme görünürlüğü `useSyncExternalStore` ile okunur, `useState` + olay
   * dinleyicisiyle DEĞİL. Sebep: `visibilitychange` yalnızca DEĞİŞİMDE
   * tetiklenir. Sayfa arka plandaki bir sekmede açıldıysa (bağlantıyı yeni
   * sekmede açmak, oturum geri yükleme, önden getirme) olay hiç gelmez ve
   * döngü kimse bakmazken saatlerce dönerdi. Bu API ilk değeri de okur;
   * sunucuda görünür varsayılır ki hidrasyon uyuşmazlığı olmasın.
   */
  const tabVisible = useSyncExternalStore(
    subscribeToVisibility,
    () => !document.hidden,
    () => true
  );

  const sectionRef = useRef<HTMLElement>(null);
  const wipeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const edgeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const running = inView && tabVisible;

  /* Sahne değişince o sahnenin CSS animasyonlarını baştan başlat.
     Bileşeni remount ETMİYORUZ: remount, içerideki <Image>'ı da söker ve
     döngü her tura yeniden istek/flash üretirdi. Reflow tetikleyip animasyonu
     sıfırlamak hem ucuz hem görselleri yerinde bırakıyor. */
  useEffect(() => {
    const restart = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = "";
    };
    restart(wipeRefs.current[active]);
    restart(edgeRefs.current[active]);
  }, [active]);

  /* Sahne geçişinin tek kapısı. Bir sonrakinin görsellerini de DOM'a alır ki
     sırası geldiğinde inmiş olsun — ama asla mevcut sahneden fazlasını değil. */
  const show = useCallback((next: number) => {
    setActive(next);
    setLoadedUpTo((n) =>
      Math.max(n, Math.min(next + 1, paintScenes.length - 1))
    );
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(
      () => show((active + 1) % paintScenes.length),
      PAINT_CYCLE_MS
    );
    return () => window.clearTimeout(id);
  }, [active, running, show]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const scene = paintScenes[active];

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[92dvh] w-full items-end overflow-hidden bg-ink"
      style={
        {
          "--paint": scene.swatch,
          "--paint-delay": `${PAINT_DELAY_MS}ms`,
          "--paint-wipe": `${PAINT_WIPE_MS}ms`,
        } as React.CSSProperties
      }
    >
      {paintScenes.slice(0, loadedUpTo + 1).map((s, i) => (
        <div
          key={s.id}
          aria-hidden
          className={cn(
            "absolute inset-0 transition-opacity duration-500 ease-out",
            i === active ? "opacity-100" : "opacity-0"
          )}
          style={{ "--paint": s.swatch } as React.CSSProperties}
        >
          {/* Bitmiş mekân — altta, hep tam */}
          <Image
            src={s.after}
            alt=""
            fill
            priority={i === 0}
            quality={70}
            sizes="100vw"
            className="object-cover"
          />

          {/* Devam eden iş — üstte, rulo geçtikçe soldan silinir */}
          <div
            ref={(el) => {
              wipeRefs.current[i] = el;
            }}
            className="paint-wipe absolute inset-0"
          >
            <Image
              src={s.before}
              alt=""
              fill
              priority={i === 0}
              quality={70}
              sizes="100vw"
              className="object-cover"
            />
          </div>

          {/* Islak kenar — maskeyle birebir aynı zamanlamada ilerler */}
          <div
            ref={(el) => {
              edgeRefs.current[i] = el;
            }}
            className="paint-edge-track absolute inset-0"
          >
            <span className="paint-edge" />
          </div>
        </div>
      ))}

      {/**
       * Karartma İKİ katman, çünkü iki ayrı işi var ve fotoğraflar değişiyor:
       *   • dikey  → en aydınlık fotoğrafta bile üstteki menünün ve alttaki
       *              nuancier satırının okunmasını garanti eder
       *   • yatay  → başlık/paragrafın durduğu sol sütunu bastırır, sağ tarafı
       *              serbest bırakır (fotoğraf orada aydınlık kalsın)
       * Değerler göz kararı değil: iki katman çarpımıyla en kötü hâlde (bembeyaz
       * bir duvar fotoğrafı) beyaz metin ~6:1'in altına düşmüyor — WCAG gövde
       * metni eşiği 4,5:1.
       */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink/88 via-ink/55 to-ink/45"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/25 to-transparent"
      />

      <div className="relative z-10 w-full px-5 pb-10 pt-32 md:px-8 md:pb-14 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <h1 className="max-w-[16ch] font-display text-[clamp(2.6rem,7.4vw,5.5rem)] leading-[1.02] tracking-[-0.025em] text-white">
            {t("titleLine1")}
            <span className="block italic text-white/85">{t("titleLine2")}</span>
          </h1>

          <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-white/75 md:text-lg">
            {t("subtitle")}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <Link
              href="/contact"
              className="btn-sweep inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-base font-medium text-white shadow-lift transition-transform duration-200 active:scale-[0.98]"
            >
              {tc("devisCta")}
            </Link>
            <a
              href={whatsappLink(tc("whatsappPrefill"))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-base font-medium text-white backdrop-blur-[2px] transition-colors duration-200 hover:border-white/70 hover:bg-white/10 active:scale-[0.98]"
            >
              <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
              {tc("whatsappCta")}
            </a>
          </div>

          {/* Nuancier: o an açılan mekânın duvar rengi + sahne seçimi */}
          <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t border-white/15 pt-5">
            <p className="flex items-center gap-3">
              <span
                aria-hidden
                className="h-9 w-9 shrink-0 rounded-md ring-1 ring-inset ring-white/25 transition-colors duration-500"
                style={{ backgroundColor: scene.swatch }}
              />
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-medium text-white">
                  {t(`scenes.${scene.id}`)}
                </span>
                <span className="tabular text-xs text-white/55">
                  {scene.swatch.toUpperCase()}
                </span>
              </span>
            </p>

            <ul className="flex items-center gap-2">
              {paintScenes.map((s, i) => (
                /* Anahtara `running` dahil: döngü durup yeniden başladığında
                   zamanlayıcı da sayaç da sıfırlanır, ikisi ayrışmaz. */
                <li key={`${s.id}-${running}`}>
                  <button
                    type="button"
                    onClick={() => show(i)}
                    aria-current={i === active}
                    aria-label={t("sceneLabel", { n: i + 1 })}
                    data-paused={!running}
                    style={
                      { "--dot-duration": `${PAINT_CYCLE_MS}ms` } as React.CSSProperties
                    }
                    className={cn(
                      "block h-1.5 rounded-full transition-all duration-300",
                      i === active
                        ? "dot-progress w-9 bg-white/25"
                        : "w-4 bg-white/35 hover:bg-white/70"
                    )}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
