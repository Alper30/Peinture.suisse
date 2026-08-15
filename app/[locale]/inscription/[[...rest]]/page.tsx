import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
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
