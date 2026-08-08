import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import { LegalText } from "./legal-text";

export type LegalSection = {
  title: string;
  /** Düz paragraflar. `[etiket](hedef)` sözdizimi desteklenir. */
  paragraphs?: string[];
  /** Madde listesi */
  items?: string[];
  /** Tablo — çerez listesi gibi yapılandırılmış veriler için */
  table?: { head: string[]; rows: string[][] };
  /** Vurgulu son not */
  note?: string;
  /**
   * Bu bölümün sonuna React içeriği yerleştirmek için ad.
   * (ör. mentions légales'deki kimlik tablosu — veri koddan gelir, çeviriden değil)
   */
  slot?: string;
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  /** "Dernière mise à jour : 2 août 2026" gibi hazır metin */
  updated: string;
  intro?: string;
  sections: LegalSection[];
  /** slot adı → render edilecek içerik */
  slots?: Record<string, ReactNode>;
  tocTitle: string;
};

const sectionId = (i: number) => `section-${i + 1}`;

export function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  sections,
  slots,
  tocTitle,
}: LegalPageProps) {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-32 pb-10 md:px-8 md:pt-44">
        <Reveal className="flex max-w-3xl flex-col gap-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            <span className="inline-block h-px w-6 bg-accent" aria-hidden />
            {eyebrow}
          </p>
          <h1 className="font-display text-4xl leading-[1.08] tracking-tight text-ink md:text-5xl">
            {title}
          </h1>
          <p className="text-sm text-muted">{updated}</p>
          {intro && (
            <p className="mt-2 text-base leading-relaxed text-muted md:text-lg">
              <LegalText>{intro}</LegalText>
            </p>
          )}
        </Reveal>
      </section>

      <div className="mx-auto max-w-6xl px-5 pb-24 md:px-8 md:pb-32">
        <div className="grid gap-12 lg:grid-cols-[240px_1fr] lg:gap-16">
          {/* Uzun metinlerde okuyucunun kaybolmaması için yapışkan içindekiler */}
          <nav
            aria-label={tocTitle}
            className="hidden lg:block lg:sticky lg:top-28 lg:self-start"
          >
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
              {tocTitle}
            </h2>
            <ol className="mt-4 space-y-2 text-sm">
              {sections.map((s, i) => (
                <li key={s.title}>
                  <a
                    href={`#${sectionId(i)}`}
                    className="text-ink/70 transition-colors hover:text-accent"
                  >
                    <span className="text-muted tabular-nums">{i + 1}.</span>{" "}
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-2xl">
            {sections.map((section, i) => (
              <section
                key={section.title}
                id={sectionId(i)}
                className="scroll-mt-28 border-t border-line pt-8 first:border-t-0 first:pt-0 [&+section]:mt-12"
              >
                <h2 className="font-display text-2xl tracking-tight text-ink md:text-3xl">
                  <span
                    aria-hidden
                    className="mr-2 text-base italic text-accent/40"
                  >
                    {i + 1}
                  </span>
                  {section.title}
                </h2>

                {section.paragraphs?.map((p, pi) => (
                  <p
                    key={pi}
                    className="mt-4 text-[15px] leading-relaxed text-ink/80"
                  >
                    <LegalText>{p}</LegalText>
                  </p>
                ))}

                {section.items && (
                  <ul className="mt-5 space-y-2.5 text-[15px] leading-relaxed text-ink/80">
                    {section.items.map((item, ii) => (
                      <li key={ii} className="flex gap-3">
                        <span
                          aria-hidden
                          className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent"
                        />
                        <span>
                          <LegalText>{item}</LegalText>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.table && (
                  // Dar ekranda tablo sayfayı yatay kaydırtmasın diye kendi kabında kayar
                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-line">
                          {section.table.head.map((h) => (
                            <th
                              key={h}
                              scope="col"
                              className="pb-3 pr-4 text-xs font-semibold uppercase tracking-widest text-muted"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row, ri) => (
                          <tr key={ri} className="border-b border-line/70">
                            {row.map((cell, ci) => (
                              <td
                                key={ci}
                                className={`py-3 pr-4 align-top leading-relaxed ${
                                  ci === 0
                                    ? "font-medium text-ink"
                                    : "text-ink/75"
                                }`}
                              >
                                <LegalText>{cell}</LegalText>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {section.slot && slots?.[section.slot]}

                {section.note && (
                  <p className="mt-5 rounded-xl border border-line bg-surface p-4 text-sm leading-relaxed text-muted">
                    <LegalText>{section.note}</LegalText>
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
