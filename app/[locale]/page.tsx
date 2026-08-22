import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PaintHero } from "@/components/home/paint-hero";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/cta-band";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import { ScrollProcess } from "@/components/scroll-process";
import { ServicesCarousel } from "@/components/ui/services-carousel";
import { TrustBand } from "@/components/home/trust-band";
import { IntroCurtain } from "@/components/intro-curtain";
import { ParallaxDuo } from "@/components/parallax-duo";
import { Faq, FaqJsonLd } from "@/components/faq";
import { Marquee } from "@/components/marquee";
import { ImageBand } from "@/components/image-band";
import { ArrowRightIcon } from "@/components/icons";
import { services } from "@/lib/services";
import { sectionTints } from "@/lib/nuancier";
import { siteConfig } from "@/lib/site-config";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("home.title"),
    description: t("home.description"),
    alternates: localeAlternates("/", locale),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const ts = await getTranslations("services.items");

  const marqueeItems = [
    ...services.map((s) => ts(`${s.key}.title`)),
    "Lausanne",
    "Genève",
    "Montreux",
    "Fribourg",
    "Neuchâtel",
    "Sion",
  ];

  return (
    <>
      <IntroCurtain />

      <PaintHero />

      <TrustBand />

      {/* Notre standard — manifesto + paralaks görsel ikilisi */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <SectionHeading
            eyebrow={t("standard.eyebrow")}
            title={t("standard.title")}
            tint={sectionTints.standard}
          />
          <Reveal delay={0.1}>
            <div className="space-y-5 text-base leading-relaxed text-ink/80 md:text-lg lg:pt-2">
              <p>{t("standard.body1")}</p>
              <p>{t("standard.body2")}</p>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="mt-16">
          <ParallaxDuo
            srcA="/images/travail-rouleau.jpg"
            srcB="/images/int-sauge.jpg"
            altA={t("standard.eyebrow")}
            altB={t("standard.eyebrow")}
          />
        </Reveal>
      </section>

      {/* Hizmetler — görsel + açıklamalı karusel */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <SectionHeading
          eyebrow={t("services.eyebrow")}
          title={t("services.title")}
          subtitle={t("services.subtitle")}
        />
        <Reveal delay={0.1} className="mt-12">
          <ServicesCarousel />
        </Reveal>
        <Reveal delay={0.15} className="mt-10 text-center">
          <Link
            href="/realisations"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-deep"
          >
            {tc("seeAllRealisations")}
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>

      <Marquee items={marqueeItems} />

      {/* Avant / Après interaktif kaydırıcı */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <SectionHeading
          eyebrow={t("beforeAfter.eyebrow")}
          title={t("beforeAfter.title")}
          subtitle={t("beforeAfter.subtitle")}
          tint={sectionTints.beforeAfter}
        />
        <Reveal delay={0.1} className="mt-10">
          <BeforeAfterSlider
            beforeSrc="/images/hero-chantier-avant.jpg"
            src="/images/int-boheme.jpg"
            alt={t("beforeAfter.title")}
          />
        </Reveal>
      </section>

      {/* Süreç — scroll'a bağlı anlatım */}
      <ScrollProcess />

      {/* Alıntı bandı: sayfadaki TEK kullanılmayan kare. Diğer 13'ü hero
          rotasyonunda ya da servis karuselinde zaten görünüyor; burada
          tekrar etmek "her duvarın kendi hikâyesi" fikrini zayıflatırdı. */}
      <ImageBand
        src="/images/platre-texture.jpg"
        alt={t("imageBand.quote")}
        quote={t("imageBand.quote")}
      />

      {/* Hizmet bölgesi */}
      <section className="bg-surface py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <SectionHeading
            eyebrow={t("areas.eyebrow")}
            title={t("areas.title")}
            subtitle={t("areas.subtitle")}
          />
          <Reveal delay={0.1} className="mt-10">
            <ul className="flex flex-wrap gap-2.5">
              {siteConfig.serviceAreas.map((area) => (
                <li
                  key={area}
                  className="rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink/80"
                >
                  {area}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <Faq />
      <FaqJsonLd />

      <CtaBand
        title={t("finalCta.title")}
        subtitle={t("finalCta.subtitle")}
        primaryLabel={t("finalCta.primary")}
        whatsappLabel={t("finalCta.secondary")}
        whatsappPrefill={tc("whatsappPrefill")}
      />
    </>
  );
}
