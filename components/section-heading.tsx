import { Reveal } from "./reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: SectionHeadingProps) {
  const alignClass =
    align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <Reveal className={`flex max-w-2xl flex-col gap-4 ${alignClass} ${align === "center" ? "mx-auto" : ""}`}>
      {eyebrow && (
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          <span className="inline-block h-px w-6 bg-accent" aria-hidden />
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
