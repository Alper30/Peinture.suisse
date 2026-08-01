import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
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
    alternates: localeAlternates("/connexion"),
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
