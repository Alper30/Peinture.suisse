import Image from "next/image";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LogoMark } from "@/components/logo";
import { CheckIcon } from "@/components/icons";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  /** Alt satırdaki karşı bağlantı: "Zaten hesabın var mı? Giriş yap" */
  switchLabel: string;
  switchHref: "/connexion" | "/inscription";
  switchCta: string;
  children: ReactNode;
};

/**
 * Kimlik sayfaları için bölünmüş düzen: solda form, sağda tam boy şantiye
 * fotoğrafı. Sağ panel yalnızca lg+ görünür; mobilde form tam genişlik alır.
 */
export async function AuthLayout({
  title,
  subtitle,
  switchLabel,
  switchHref,
  switchCta,
  children,
}: AuthLayoutProps) {
  const t = await getTranslations("auth");

  return (
    // .auth-screen: site başlığı/altbilgisi bu sayfalarda gizlenir (globals.css)
    <div className="auth-screen grid min-h-[100svh] lg:grid-cols-[minmax(0,1fr)_1.1fr]">
      {/* Sol: form */}
      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5"
            aria-label="Peinture Suisse"
          >
            <LogoMark className="h-9 w-auto" />
            <span className="font-display text-xl leading-none tracking-tight text-ink">
              Peinture<span className="italic text-accent"> Suisse</span>
            </span>
          </Link>

          <h1 className="mt-10 font-display text-4xl leading-[1.1] tracking-tight text-ink md:text-5xl">
            {title}
          </h1>
          <p className="mt-3 leading-relaxed text-muted">{subtitle}</p>

          <div className="mt-9">{children}</div>

          <p className="mt-8 text-sm text-muted">
            {switchLabel}{" "}
            <Link
              href={switchHref}
              className="font-medium text-accent transition-colors hover:text-accent-deep"
            >
              {switchCta}
            </Link>
          </p>
        </div>
      </div>

      {/* Sağ: fotoğraf + değer önerisi */}
      <div className="relative hidden lg:block">
        <Image
          src="/images/hero-peintre-v2.jpg"
          alt=""
          fill
          priority
          sizes="55vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/20"
        />

        <div className="absolute inset-x-0 bottom-0 p-12 xl:p-16">
          <p className="max-w-lg font-display text-3xl leading-snug text-white xl:text-4xl">
            {t("promise")}
          </p>
          <ul className="mt-8 space-y-3">
            {(["benefit1", "benefit2", "benefit3"] as const).map((key) => (
              <li key={key} className="flex items-center gap-3 text-white/85">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent">
                  <CheckIcon className="h-3.5 w-3.5 text-white" />
                </span>
                <span className="text-sm">{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
