import { getTranslations } from "next-intl/server";
import { CheckIcon } from "@/components/icons";

const KEYS = ["t1", "t2", "t3", "t4"] as const;

/**
 * Hero'nun hemen altındaki koyu güven bandı — verilebilir sözler, sahte rozet yok.
 * Masaüstünde statik 4 sütun; mobil/tablette sağdan sola akan şerit (marquee).
 */
export async function TrustBand() {
  const t = await getTranslations("home.trustBand");

  const item = (key: (typeof KEYS)[number]) => (
    <div className="flex shrink-0 items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-accent">
        <CheckIcon className="h-4.5 w-4.5" />
      </span>
      <span className="whitespace-nowrap text-sm font-medium tracking-wide text-white/90">
        {t(key)}
      </span>
    </div>
  );

  return (
    <section className="overflow-hidden bg-ink">
      {/* Mobil + tablet: akan şerit */}
      <div className="marquee py-6 lg:hidden">
        <div
          className="animate-marquee flex w-max"
          style={{ animationDuration: "22s" }}
        >
          <div className="flex shrink-0 items-center gap-10 pr-10">
            {KEYS.map((key) => (
              <div key={key}>{item(key)}</div>
            ))}
          </div>
          <div aria-hidden className="flex shrink-0 items-center gap-10 pr-10">
            {KEYS.map((key) => (
              <div key={`dup-${key}`}>{item(key)}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Masaüstü: statik 4 sütun */}
      <div className="mx-auto hidden max-w-6xl grid-cols-4 gap-x-8 px-8 py-10 lg:grid">
        {KEYS.map((key) => (
          <div key={key}>{item(key)}</div>
        ))}
      </div>
    </section>
  );
}
