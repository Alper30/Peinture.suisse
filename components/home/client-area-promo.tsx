import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/reveal";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";

/**
 * Anasayfada müşteri alanını tanıtan bölüm.
 * Kayıt bağlantısı yalnızca giriş sayfasının içinde kalıyordu — müşteri
 * hesap oluşturabileceğini fark etmiyordu. Burası o keşif noktası.
 */
export async function ClientAreaPromo() {
  const t = await getTranslations("clientArea.promo");
  const ta = await getTranslations("auth");

  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            <span className="inline-block h-px w-6 bg-accent" aria-hidden />
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight text-ink md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-muted md:text-lg">
            {t("subtitle")}
          </p>

          <ul className="mt-8 space-y-3">
            {(["benefit1", "benefit2", "benefit3"] as const).map((key) => (
              <li key={key} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                  <CheckIcon className="h-3.5 w-3.5 text-accent" />
                </span>
                <span className="text-sm leading-relaxed text-ink/80">
                  {ta(key)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-base font-medium text-white shadow-card transition-all duration-300 hover:bg-accent-deep hover:shadow-lift active:scale-[0.98]"
            >
              {t("ctaCreate")}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/connexion"
              className="inline-flex items-center justify-center rounded-full border border-line px-7 py-3.5 text-base font-medium text-ink transition-all duration-300 hover:border-ink/30 hover:bg-paper active:scale-[0.98]"
            >
              {t("ctaLogin")}
            </Link>
          </div>

          <p className="mt-5 text-xs leading-relaxed text-muted">{t("note")}</p>
        </div>

        <Reveal delay={0.1}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift">
            <Image
              src="/images/platre-texture.jpg"
              alt={t("title")}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
