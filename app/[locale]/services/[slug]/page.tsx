import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/cta-band";
import { TiltCard } from "@/components/ui/tilt-card";
import { serviceIcons, CheckIcon, ArrowRightIcon } from "@/components/icons";
import { services, getService } from "@/lib/services";
import { localeAlternates } from "@/lib/seo";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    services.map((s) => ({ locale, slug: s.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  const t = await getTranslations({ locale, namespace: "services.items" });
  return {
    title: t(`${service.key}.title`),
    description: t(`${service.key}.short`),
    alternates: localeAlternates(`/services/${slug}`),
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Params;
}) {
  const { locale, slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  setRequestLocale(locale);

  const t = await getTranslations("services");
  const ti = await getTranslations(`services.items.${service.key}`);
  const tn = await getTranslations("nav");
  const tc = await getTranslations("common");

  const Icon = serviceIcons[service.icon];
  const otherServices = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      {/* Başlık */}
      <section className="mx-auto max-w-6xl px-5 pt-32 pb-14 md:px-8 md:pt-44">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              <span className="inline-block h-px w-6 bg-accent" aria-hidden />
              {tn("services")}
            </p>
            <div className="mt-5 flex items-start gap-5">
              <span className="mt-1 hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent md:flex">
                <Icon className="h-7 w-7" />
              </span>
              <div>
                <h1 className="font-display text-4xl leading-[1.06] tracking-tight text-ink sm:text-5xl md:text-6xl">
                  {ti("title")}
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
                  {ti("intro")}
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift">
              <Image
                src={service.image}
                alt={ti("title")}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Kapsam */}
      <section className="bg-surface py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <Reveal>
                <ul className="grid gap-3.5 sm:grid-cols-2">
                  {(["f1", "f2", "f3", "f4", "f5", "f6"] as const).map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 rounded-xl border border-line bg-paper px-4 py-3.5 text-sm text-ink/85"
                    >
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {ti(`features.${f}`)}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="mt-10 space-y-5 text-base leading-relaxed text-ink/80">
                  <p>{ti("body1")}</p>
                  <p>{ti("body2")}</p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.15}>
              <aside className="h-fit rounded-2xl border border-line bg-paper p-7">
                <h2 className="font-display text-xl tracking-tight text-ink">
                  {t("included")}
                </h2>
                <ul className="mt-5 space-y-3 text-sm text-ink/85">
                  {(["item1", "item2", "item3", "item4"] as const).map((k) => (
                    <li key={k} className="flex items-start gap-2.5">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {t(`includedItems.${k}`)}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-white shadow-card transition-all duration-300 hover:bg-accent-deep hover:shadow-lift active:scale-[0.98]"
                >
                  {t("requestQuote")}
                </Link>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Görsel mozaiği — 3D tilt */}
      <section className="mx-auto max-w-6xl px-5 pt-16 md:px-8">
        <div className="grid gap-5 sm:grid-cols-3">
          <Reveal className="sm:col-span-2">
            <TiltCard>
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={service.gallery[0]}
                  alt={ti("title")}
                  fill
                  sizes="(max-width: 640px) 100vw, 66vw"
                  className="object-cover"
                />
              </div>
            </TiltCard>
          </Reveal>
          <Reveal delay={0.1}>
            <TiltCard>
              <div className="relative h-full min-h-[16rem] w-full sm:min-h-full">
                <Image
                  src={service.gallery[1]}
                  alt={ti("title")}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* Diğer hizmetler */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <Reveal>
          <h2 className="font-display text-2xl tracking-tight text-ink">
            {t("otherServices")}
          </h2>
        </Reveal>
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {otherServices.map((s, i) => {
            const OtherIcon = serviceIcons[s.icon];
            return (
              <Reveal key={s.slug} delay={i * 0.06}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex items-center gap-3.5 rounded-2xl border border-line bg-surface px-5 py-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <OtherIcon className="h-5 w-5" />
                  </span>
                  <span className="flex-1 text-sm font-medium text-ink">
                    {t(`items.${s.key}.title`)}
                  </span>
                  <ArrowRightIcon className="h-4 w-4 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent" />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <CtaBand
        title={t("ctaBand.title")}
        subtitle={t("ctaBand.subtitle")}
        primaryLabel={t("requestQuote")}
        whatsappLabel={tc("whatsappCta")}
        whatsappPrefill={tc("whatsappPrefill")}
      />
    </>
  );
}
