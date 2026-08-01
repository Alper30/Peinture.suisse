import { LogoMark } from "./logo";

/**
 * Kurumsal kilit: logo işareti + "Peinture Suisse" + RÉNOVATION etiketi.
 * Kullanıcının logosundaki düzene uyarlandı.
 * tone="light": koyu zeminler (hero fotoğrafı) üzerinde beyaz versiyon.
 */
export function Wordmark({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const light = tone === "light";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark tone={tone} className="h-10 w-auto shrink-0" />
      <span className="inline-flex flex-col">
        <span
          className={`font-display text-[22px] leading-none tracking-tight transition-colors duration-300 ${
            light ? "text-white" : "text-ink"
          }`}
        >
          Peinture<span className="italic text-accent"> Suisse</span>
        </span>
        <span
          className={`mt-1.5 flex items-center gap-2 text-[7.5px] font-semibold uppercase leading-none tracking-[0.3em] transition-colors duration-300 ${
            light ? "text-white/75" : "text-muted"
          }`}
        >
          <span className="h-px flex-1 bg-accent/70" aria-hidden />
          Rénovation
          <span className="h-px flex-1 bg-accent/70" aria-hidden />
        </span>
      </span>
    </span>
  );
}
