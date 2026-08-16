import { Reveal } from "./reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  /**
   * O bölümde GÖSTERİLEN fotoğraftan örneklenmiş duvar rengi (bkz.
   * lib/nuancier.ts → sectionTints). Verilirse çizgi yerine bir boya çipi
   * çizilir; hero'daki nuancier ile aynı dil.
   *
   * Yalnızca gerçekten bir rengi olan bölümlere verilir — her başlığa rastgele
   * bir renk dağıtmak süs olurdu, bilgi değil.
   */
  tint?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tint,
}: SectionHeadingProps) {
  const alignClass =
    align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <Reveal className={`flex max-w-2xl flex-col gap-4 ${alignClass} ${align === "center" ? "mx-auto" : ""}`}>
      {eyebrow && (
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {tint ? (
            /* Halka şart: örneklenen renklerin çoğu açık nötr; halkasız çip
               kağıt zemininde kaybolurdu. */
            <span
              aria-hidden
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-[3px] ring-1 ring-inset ring-ink/20"
              style={{ backgroundColor: tint }}
            />
          ) : (
            <span className="inline-block h-px w-6 bg-accent" aria-hidden />
          )}
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-4xl leading-[1.08] tracking-tight text-ink md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base leading-relaxed text-muted md:text-lg">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
