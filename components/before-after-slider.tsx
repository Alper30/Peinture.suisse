"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

type BeforeAfterSliderProps = {
  src: string;
  alt: string;
  /** "Önce" karesi için ayrı görsel; verilmezse aynı görselin filtreli hali kullanılır */
  beforeSrc?: string;
  className?: string;
};

/**
 * Sürüklenebilir önce/sonra karşılaştırma kaydırıcısı.
 * - Pointer (fare + dokunmatik) ile sürükleme
 * - Klavye erişimi: gizli range input (ok tuşları)
 * - beforeSrc yoksa "önce" katmanı CSS filtresiyle simüle edilir
 */
export function BeforeAfterSlider({
  src,
  alt,
  beforeSrc,
  className = "",
}: BeforeAfterSliderProps) {
  const t = useTranslations("home.beforeAfter");
  const tr = useTranslations("realisations");
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(55);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, pct)));
  }, []);

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="group relative aspect-[16/9] cursor-ew-resize touch-none select-none overflow-hidden rounded-3xl shadow-lift"
        onPointerDown={(e) => {
          dragging.current = true;
          updateFromClientX(e.clientX);
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            // sentetik/eski pointer olaylarında capture desteklenmeyebilir
          }
        }}
        onPointerMove={(e) => {
          if (dragging.current) updateFromClientX(e.clientX);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
      >
        {/* Sonra (tam görsel) */}
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
        />

        {/* Önce katmanı: clip-path ile soldan pos% görünür */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          {beforeSrc ? (
            <Image
              src={beforeSrc}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          ) : (
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              style={{
                filter:
                  "grayscale(0.55) sepia(0.22) brightness(0.78) contrast(0.92)",
              }}
            />
          )}
          {/* eski duvar hissi: hafif leke dokusu */}
          {!beforeSrc && (
            <div
              className="absolute inset-0 opacity-30 mix-blend-multiply"
              style={{
                background:
                  "radial-gradient(ellipse 40% 30% at 20% 25%, rgb(90 75 55 / 0.5), transparent 70%), radial-gradient(ellipse 35% 45% at 75% 70%, rgb(80 70 55 / 0.4), transparent 70%), radial-gradient(ellipse 25% 20% at 55% 15%, rgb(95 85 65 / 0.45), transparent 70%)",
              }}
            />
          )}
        </div>

        {/* Ayırıcı çizgi + tutamaç */}
        <div
          aria-hidden
          className="absolute inset-y-0 z-10 w-0.5 bg-white shadow-[0_0_12px_rgb(0_0_0/0.35)]"
          style={{ left: `${pos}%` }}
        >
          {/* Tutamaç: imleç kutunun üstüne gelince hafifçe büyür ("beni sürükle"),
              basılıyken küçülür ("tuttum"). 150–200 ms — mikro geri bildirim
              bandı; daha uzunu gecikme gibi hissettirir. Çizgi bilerek net
              beyaz kaldı: hero'daki yumuşak boya kenarı buraya konsaydı
              tutamacın nerede olduğu okunmaz olurdu. */}
          <div className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lift transition-transform duration-150 ease-out group-hover:scale-105 group-active:scale-95">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-ink"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 6-4 6 4 6M15 6l4 6-4 6" />
            </svg>
          </div>
        </div>

        {/* Etiketler */}
        <span className="pointer-events-none absolute top-4 left-4 z-10 rounded-full bg-ink/75 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {tr("labelBefore")}
        </span>
        <span className="pointer-events-none absolute top-4 right-4 z-10 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-ink backdrop-blur">
          {tr("labelAfter")}
        </span>

        {/* Klavye erişimi */}
        <input
          type="range"
          min={4}
          max={96}
          value={Math.round(pos)}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={t("sliderLabel")}
          className="absolute inset-x-6 bottom-3 z-20 h-6 w-auto cursor-ew-resize appearance-none rounded-full bg-transparent opacity-0 focus-visible:opacity-100 focus-visible:bg-white/40 focus-visible:outline-2 focus-visible:outline-accent"
        />
      </div>

      <p className="mt-3 text-xs text-muted">{t("note")}</p>
    </div>
  );
}
