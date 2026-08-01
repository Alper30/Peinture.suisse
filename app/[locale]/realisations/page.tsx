import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/cta-band";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import { TiltCard } from "@/components/ui/tilt-card";
import { localeAlternates } from "@/lib/seo";

/* Galeri karoları: her karo farklı sahne, hepsi zanaatla alakalı —
   aynı sayfada bir görselin kendisi ve kırpımı ASLA birlikte kullanılmaz */
const galleryTiles = [
  { src: "/images/hero-peintre-v2.jpg", key: "peintureInterieure" },
  { src: "/images/travail-rouleau.jpg", key: "peintureInterieure" },
  { src: "/images/facade-crepi.jpg", key: "crepisFacades" },
  { src: "/images/archi-blanche.jpg", key: "crepisFacades" },
  { src: "/images/platre-lissage.jpg", key: "platrerie" },
  { src: "/images/hero-chantier-avant.jpg", key: "renovation" },
  { src: "/images/hero-salon-apres.jpg", key: "renovation" },
  { src: "/images/int-sauge.jpg", key: "peintureInterieure" },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("realisations.title"),
    description: t("realisations.description"),
    alternates: localeAlternates("/realisations"),
  };
}

export default async function RealisationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("realisations");
  const tc = await getTranslations("common");
  const ts = await getTranslations("services.items");

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-32 pb-12 md:px-8 md:pt-44">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

      </section>

      {/* İnteraktif avant/après */}
      <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
        <Reveal>
          <BeforeAfterSlider
            src="/images/interieur-salon.jpg"
            alt={t("title")}
          />
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 md:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {galleryTiles.map((tile, i) => (
            <Reveal key={`${tile.src}-${i}`} delay={(i % 2) * 0.07}>
              <TiltCard>
                <figure className="relative">
                  <Image
                    src={tile.src}
                    alt={ts(`${tile.key}.title`)}
                    width={1200}
                    height={896}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    {ts(`${tile.key}.title`)}
                  </span>
                </figure>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
        primaryLabel={t("cta.primary")}
        whatsappLabel={tc("whatsappCta")}
        whatsappPrefill={tc("whatsappPrefill")}
      />
    </>
  );
}
