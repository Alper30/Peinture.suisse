import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { clientAreaEnabled, siteConfig, whatsappLink } from "@/lib/site-config";
import { services } from "@/lib/services";
import { Wordmark } from "./wordmark";
import { InstagramIcon, TikTokIcon } from "./icons";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const ts = await getTranslations("services.items");
  const tca = await getTranslations("clientArea");
  const tl = await getTranslations("legal");

  const year = new Date().getFullYear();

  // Yasal sayfalar footer'da kendi sütununda: alt şeritteki küçük gri yazı
  // kolayca gözden kaçıyordu; kurumsal bir sitede bunların bulunabilir olması gerek.
  const legalLinks = [
    ["/mentions-legales", "mentions"],
    ["/politique-de-confidentialite", "confidentialite"],
    ["/cookies", "cookies"],
    ["/conditions-generales", "conditions"],
  ] as const;

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {t("tagline")}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-ink/40 hover:text-ink"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-ink/40 hover:text-ink"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          <nav aria-label={t("navTitle")}>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">
              {t("navTitle")}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {(
                [
                  ["/", "home"],
                  ["/realisations", "realisations"],
                  ["/a-propos", "about"],
                  ["/blog", "blog"],
                  ["/contact", "contact"],
                ] as const
              ).map(([href, key]) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-ink/80 transition-colors hover:text-accent"
                  >
                    {tn(key)}
                  </Link>
                </li>
              ))}
              {/* Müşteri alanı: kimlik bağlantısının aranacağı ikinci yer.
                  İçi dolana kadar gizli — bkz. lib/site-config.ts */}
              {clientAreaEnabled && (
                <li>
                  <Link
                    href="/connexion"
                    className="text-ink/80 transition-colors hover:text-accent"
                  >
                    {tca("nav")}
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <nav aria-label={t("servicesTitle")}>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">
              {t("servicesTitle")}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-ink/80 transition-colors hover:text-accent"
                  >
                    {ts(`${s.key}.title`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={tl("navTitle")}>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">
              {tl("navTitle")}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {legalLinks.map(([href, key]) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-ink/80 transition-colors hover:text-accent"
                  >
                    {tl(`${key}.nav`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">
              {t("contactTitle")}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink/80">
              <li>
                <a
                  href={siteConfig.phoneHref}
                  className="transition-colors hover:text-accent"
                >
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  WhatsApp — {siteConfig.whatsappDisplay}
                </a>
              </li>
              {/* E-posta adresi kurulana kadar bu satır görünmez (bkz. site-config) */}
              {siteConfig.email && (
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="transition-colors hover:text-accent"
                  >
                    {siteConfig.email}
                  </a>
                </li>
              )}
              <li className="pt-2 text-muted">
                <span className="block text-xs font-semibold uppercase tracking-widest">
                  {t("areasTitle")}
                </span>
                <span className="mt-1 block">{t("areasText")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-line pt-6 text-xs text-muted">
          {t("copyright", { year })}
        </div>
      </div>
    </footer>
  );
}
