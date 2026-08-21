import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { clientAreaEnabled } from "@/lib/site-config";
import { UserButton } from "@clerk/nextjs";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/reveal";
import { ArrowRightIcon, MailIcon, PhoneIcon } from "@/components/icons";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "clientArea" });
  return {
    title: t("eyebrow"),
    // Kişisel alan: arama motorlarına kapalı
    robots: { index: false, follow: false },
  };
}

const CARDS = ["quote", "project", "documents"] as const;

export default async function ClientAreaPage({
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

  const t = await getTranslations("clientArea");

  /**
   * Yetki kontrolü BURADA, kaynağın kendisinde yapılıyor — proxy'ye
   * güvenilmiyor.
   *
   * Eskiden bu satırda "proxy.ts korumalı rotayı zaten doğruluyor" yazıyordu.
   * Clerk 7 tam olarak bu deseni kendi kodunda deprecate etti: proxy koruması
   * YOL EŞLEŞTİRMESİNE dayanır ve Next'in isteği gerçekte nasıl yönlendirdiğiyle
   * ayrışabilir. proxy.ts'teki matcher içinde nokta geçen HER yolu atlıyor
   * (`.*\..*`) — statik dosya olmayan noktalı yollar (örn. Vercel'in
   * `.prefetch.rsc` istekleri) ve ileride eklenecek `/api/...` rotaları
   * korumadan hiç geçmez.
   *
   * Matcher'ı kurcalamak yerine kontrolü kaynağa taşımak doğru çözüm: matcher
   * ne yaparsa yapsın, oturumu olmayan hiç kimse bu sayfanın verisini göremez.
   * Proxy artık ikinci savunma hattı.
   *
   * Bugün kartlar boş, yani sızacak veri yok. Kontrol şimdiden duruyor ki
   * kartlara gerçek teklif ve belgeler bağlandığında açık kendiliğinden
   * doğmasın.
   */
  const { userId } = await auth();
  if (!userId) {
    redirect(`/${locale}/connexion`);
  }

  const user = await currentUser();
  const name = user?.firstName ?? user?.username ?? "";

  return (
    <div className="mx-auto max-w-6xl px-5 pt-32 pb-24 md:px-8 md:pt-44">
      <Reveal>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              <span className="inline-block h-px w-6 bg-accent" aria-hidden />
              {t("eyebrow")}
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight text-ink md:text-5xl">
              {t("greeting", { name })}
            </h1>
            <p className="mt-3 leading-relaxed text-muted">{t("subtitle")}</p>
          </div>
          {/* Clerk'in hesap yönetimi: profil, şifre, oturum kapatma */}
          <UserButton
            appearance={{
              elements: { avatarBox: "h-11 w-11 rounded-full" },
            }}
          />
        </div>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {CARDS.map((key, i) => (
          <Reveal key={key} delay={i * 0.07}>
            <div className="flex h-full flex-col rounded-2xl border border-line bg-surface p-7 shadow-card">
              <h2 className="font-display text-2xl tracking-tight text-ink">
                {t(`cards.${key}.title`)}
              </h2>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                {t(`cards.${key}.empty`)}
              </p>
              <span
                aria-hidden
                className="mt-6 block h-1 w-10 rounded-full bg-line"
              />
            </div>
          </Reveal>
        ))}
      </div>

      {/* Yardım bloğu */}
      <Reveal delay={0.15}>
        <div className="mt-10 grid gap-6 rounded-3xl bg-ink px-8 py-10 md:grid-cols-[1.2fr_0.8fr] md:items-center md:px-12">
          <div>
            <h2 className="font-display text-2xl tracking-tight text-white md:text-3xl">
              {t("help.title")}
            </h2>
            <p className="mt-3 leading-relaxed text-white/70">
              {t("help.subtitle")}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/contact"
              className="btn-sweep inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-all duration-300 active:scale-[0.98]"
            >
              {t("help.cta")}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <a
              href={siteConfig.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/60"
            >
              <PhoneIcon className="h-4 w-4" />
              {siteConfig.phoneDisplay}
            </a>
            {/* E-posta adresi kurulana kadar gösterilmez (bkz. site-config) */}
            {siteConfig.email && (
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center justify-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
              >
                <MailIcon className="h-4 w-4" />
                {siteConfig.email}
              </a>
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
