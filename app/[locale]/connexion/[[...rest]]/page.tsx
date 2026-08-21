import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
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
    title: t("signIn.title"),
    description: t("signIn.subtitle"),
    alternates: localeAlternates("/connexion", locale),
    // Giriş sayfaları arama sonuçlarında görünmemeli
    robots: { index: false, follow: true },
  };
}

export default async function SignInPage({
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
      title={t("signIn.title")}
      subtitle={t("signIn.subtitle")}
      switchLabel={t("signIn.switchLabel")}
      switchHref="/inscription"
      switchCta={t("signIn.switchCta")}
    >
      <SignIn
        routing="path"
        path={`/${locale}/connexion`}
        signUpUrl={`/${locale}/inscription`}
        fallbackRedirectUrl={`/${locale}/espace-client`}
      />
    </AuthLayout>
  );
}
