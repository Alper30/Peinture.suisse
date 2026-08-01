import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ClerkProvider } from "@clerk/nextjs";
import { deDE, enUS, frFR } from "@clerk/localizations";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/lib/site-config";
import "../globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Clerk arayüzü kullanıcının diliyle görünsün */
const clerkLocalizations: Record<string, typeof frFR> = {
  fr: frFR,
  de: deDE,
  en: enUS,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(siteConfig.baseUrl),
    title: {
      default: `${t("home.title")} | ${t("siteName")}`,
      template: `%s | ${t("siteName")}`,
    },
    description: t("home.description"),
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      locale,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("common");

  return (
    <html
      lang={locale}
      className={`${instrumentSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd locale={locale} />
        {/* ClerkProvider <body> içinde: Next 16 cache components ile uyum için */}
        <ClerkProvider
          localization={clerkLocalizations[locale] ?? frFR}
          appearance={clerkAppearance}
        >
          <NextIntlClientProvider>
            <a href="#contenu" className="skip-link">
              {t("skipToContent")}
            </a>
            <SiteHeader />
            <main id="contenu" className="flex-1">
              {children}
            </main>
            <SiteFooter />
            <WhatsAppButton />
          </NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
