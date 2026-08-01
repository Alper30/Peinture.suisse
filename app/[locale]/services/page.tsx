import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/cta-band";
import { serviceIcons, ArrowRightIcon, CheckIcon } from "@/components/icons";
import { services } from "@/lib/services";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("services.title"),
    description: t("services.description"),
    alternates: localeAlternates("/services"),
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("services");
  const tn = await getTranslations("nav");
  const tc = await getTranslations("common");
  const tm = await getTranslations("meta");

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-32 pb-16 md:px-8 md:pt-44">
        <SectionHeading
          eyebrow={tn("services")}
          title={tm("services.title")}
          subtitle={t("indexIntro")}
        />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 md:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((service, i) => {
            const Icon = serviceIcons[service.icon];
            return (
              <Reveal key={service.slug} delay={i * 0.07}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative aspect-[16/8] w-full overflow-hidden">
                    <Image
                      src={service.image}
                      alt={t(`items.${service.key}.title`)}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-8 md:p-10">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h2 className="font-display text-2xl tracking-tight text-ink md:text-3xl">
                      {t(`items.${service.key}.title`)}
                    </h2>
                  </div>
                  <p className="mt-5 flex-1 text-sm leading-relaxed text-muted md:text-base">
                    {t(`items.${service.key}.intro`)}
                  </p>
                  <ul className="mt-6 grid gap-2.5 text-sm text-ink/80 sm:grid-cols-2">
                    {(["f1", "f2", "f3", "f4"] as const).map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {t(`items.${service.key}.features.${f}`)}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-accent">
                    {tc("readMore")}
                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <CtaBand
        title={t("ctaBand.title")}
        subtitle={t("ctaBand.subtitle")}
        primaryLabel={t("ctaBand.cta")}
        whatsappLabel={tc("whatsappCta")}
        whatsappPrefill={tc("whatsappPrefill")}
      />
    </>
  );
}
