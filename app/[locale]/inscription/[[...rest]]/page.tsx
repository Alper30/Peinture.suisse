import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { clientAreaEnabled } from "@/lib/site-config";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthLayout } from "@/components/auth/auth-layout";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return {
    title: t("signUp.title"),
    description: t("signUp.subtitle"),
    alternates: localeAlternates("/inscription", locale),
    robots: { index: false, follow: true },
  };
}

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  /**
   * Müşteri alanı kapalıyken bu rota yayında değil.
   *
   * Kök layout o durumda ClerkProvider'ı hiç render etmiyor (~123 KB tasarruf),
   * dolayısıyla buradaki Clerk bileşenleri zaten çalışamazdı. Boş bir hata
   * yerine dürüst bir 404 dönüyoruz. Bayrak `true` olduğunda sayfa olduğu gibi
   * geri gelir. Bkz. lib/site-config.ts
   */
  if (!clientAreaEnabled) {
    notFound();
  }
  const t = await getTranslations("auth");

  return (
    <AuthLayout
      title={t("signUp.title")}
      subtitle={t("signUp.subtitle")}
      switchLabel={t("signUp.switchLabel")}
      switchHref="/connexion"
      switchCta={t("signUp.switchCta")}
    >
      <SignUp
        routing="path"
        path={`/${locale}/inscription`}
        signInUrl={`/${locale}/connexion`}
        fallbackRedirectUrl={`/${locale}/espace-client`}
      />
    </AuthLayout>
  );
}
