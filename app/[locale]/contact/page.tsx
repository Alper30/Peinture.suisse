import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { DevisForm } from "@/components/devis-form";
import { TiltCard } from "@/components/ui/tilt-card";
import {
  MailIcon,
  PhoneIcon,
  PinIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("contact.title"),
    description: t("contact.description"),
    alternates: localeAlternates("/contact"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");
  const tc = await getTranslations("common");

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-32 pb-12 md:px-8 md:pt-44">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <Reveal>
            <DevisForm />
          </Reveal>

          <Reveal delay={0.12}>
            <aside className="space-y-6">
              <TiltCard>
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src="/images/platre-texture.jpg"
                    alt={t("title")}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </TiltCard>

              <div className="rounded-2xl border border-line bg-surface p-7 shadow-card">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
                  {t("infoTitle")}
                </h2>
                <ul className="mt-5 space-y-4 text-sm">
                  <li>
                    <a
                      href={siteConfig.phoneHref}
                      className="group flex items-center gap-3.5"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                        <PhoneIcon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-xs uppercase tracking-wider text-muted">
                          {t("infoPhone")}
                        </span>
                        <span className="font-medium text-ink transition-colors group-hover:text-accent">
                          {siteConfig.phoneDisplay}
                        </span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={whatsappLink(tc("whatsappPrefill"))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3.5"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                        <WhatsAppIcon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-xs uppercase tracking-wider text-muted">
                          {t("infoWhatsapp")}
                        </span>
                        <span className="font-medium text-ink transition-colors group-hover:text-accent">
                          {t("infoWhatsappText")}
                        </span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="group flex items-center gap-3.5"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                        <MailIcon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-xs uppercase tracking-wider text-muted">
                          {t("infoEmail")}
                        </span>
                        <span className="font-medium text-ink transition-colors group-hover:text-accent">
                          {siteConfig.email}
                        </span>
                      </span>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-line bg-surface p-7 shadow-card">
                <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted">
                  <PinIcon className="h-4 w-4 text-accent" />
                  {t("areasTitle")}
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {siteConfig.serviceAreas.map((area) => (
                    <li
                      key={area}
                      className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs text-ink/80"
                    >
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  );
}
