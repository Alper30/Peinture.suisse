import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/cta-band";
import { TiltCard } from "@/components/ui/tilt-card";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("about.title"),
    description: t("about.description"),
    alternates: localeAlternates("/a-propos", locale),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");
  const tc = await getTranslations("common");

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-32 pb-16 md:px-8 md:pt-44">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <SectionHeading
              eyebrow={t("eyebrow")}
              title={t("title")}
              subtitle={t("intro")}
            />
            <Reveal delay={0.1}>
              <div className="mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-ink/80">
                <p>{t("body1")}</p>
                <p>{t("body2")}</p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <TiltCard className="lg:mt-8">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/hero-peintre-v2.jpg"
                  alt={t("title")}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      <section className="bg-surface py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <SectionHeading
              eyebrow={t("values.eyebrow")}
              title={t("values.title")}
            />
            {/* Zanaat detayı: taze crépi dokusu — "soin du détail" sözünün görsel karşılığı */}
            <Reveal delay={0.12} className="mt-9">
              <TiltCard>
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src="/images/crepi-texture.jpg"
                    alt={t("values.v2Title")}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </TiltCard>
            </Reveal>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {([1, 2, 3, 4] as const).map((n, i) => (
              <Reveal key={n} delay={i * 0.07}>
                <div className="h-full rounded-2xl border border-line bg-paper p-7 md:p-8">
                  <p
                    aria-hidden
                    className="font-display text-4xl italic text-accent/25"
                  >
                    0{n}
                  </p>
                  <h3 className="mt-3 font-display text-2xl tracking-tight text-ink">
                    {t(`values.v${n}Title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {t(`values.v${n}Text`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="pt-20 md:pt-24">
        <CtaBand
          title={t("cta.title")}
          primaryLabel={t("cta.primary")}
          whatsappLabel={tc("whatsappCta")}
          whatsappPrefill={tc("whatsappPrefill")}
        />
      </div>
    </>
  );
}
