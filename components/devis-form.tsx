"use client";

import { useActionState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { submitDevis, type DevisFormState } from "@/lib/devis-action";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import { CheckIcon, PhoneIcon, WhatsAppIcon } from "./icons";

const initialState: DevisFormState = { status: "idle" };

/**
 * Yüzen etiket (floating label) tamamen CSS ile:
 * `peer-placeholder-shown` alan boşken etiketi ortaya indirir, `peer-focus`
 * yeniden yukarı kaldırır. JS yok, layout shift yok.
 *
 * Placeholder metni odaklanana kadar saydam — böylece etiket ile placeholder
 * üst üste binmez ama `:placeholder-shown` seçicisi çalışmaya devam eder.
 */
const fieldBase =
  "peer w-full rounded-xl border bg-paper px-4 text-sm text-ink outline-none transition-all duration-200 placeholder:text-transparent focus:border-accent focus:bg-surface focus:ring-4 focus:ring-accent/10 focus:placeholder:text-muted/50";

/**
 * Etiketin iki durumu piksel değerleriyle tanımlı — `top-1/2` + `-translate-y-1/2`
 * ikilisi yerine düz `top-[…]`: kesirli ve negatif yardımcı sınıfları varyant
 * altında zincirlemek gereksiz yere kırılgan, tek özellik animasyonu yeterli.
 *
 * Temel durum = yukarı kalkmış etiket. `peer-placeholder-shown` (alan boş) onu
 * ortaya indirir, `peer-focus` yeniden kaldırır — sıralama önemli.
 */
const labelFloated =
  "top-[9px] text-[11px] font-semibold uppercase tracking-wider";
const labelResting =
  "peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal";
const labelRefloat =
  "peer-focus:top-[9px] peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider";

const labelBase =
  "pointer-events-none absolute left-4 text-muted transition-all duration-200 peer-focus:text-accent";

function Field({
  id,
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
  required,
  error,
  errorId,
  textarea,
  className,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
  errorId?: string;
  textarea?: boolean;
  className?: string;
}) {
  // Hatalı alan kırmızı kenarlıkla da işaretlenir — yalnızca alttaki yazı
  // renk körü kullanıcılar ve hızlı tarama için yeterli bir sinyal değil.
  const borderClass = error
    ? "border-accent ring-4 ring-accent/10"
    : "border-line hover:border-ink/25";

  return (
    <div className={`relative ${className ?? ""}`}>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={5}
          placeholder={placeholder}
          aria-describedby={errorId}
          aria-invalid={error ? true : undefined}
          className={`${fieldBase} ${borderClass} resize-y pt-7 pb-3`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-describedby={errorId}
          aria-invalid={error ? true : undefined}
          className={`${fieldBase} ${borderClass} h-14 pt-5`}
        />
      )}
      <label
        htmlFor={id}
        className={`${labelBase} ${labelFloated} ${
          textarea
            ? "peer-placeholder-shown:top-[22px]"
            : "peer-placeholder-shown:top-[18px]"
        } ${labelResting} ${labelRefloat}`}
      >
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
    </div>
  );
}

/**
 * Prestation seçimi: yerel `<select>` yerine çipler.
 * Mobilde tek dokunuşla seçilir, tüm seçenekler aynı anda görünür ve
 * `appearance-none` ile okunu kaybetmiş bir açılır liste bırakmaz.
 */
function ServiceChips() {
  const t = useTranslations("contact.form");
  const keys = [
    "peintureInterieure",
    "crepisFacades",
    "platrerie",
    "renovation",
    "autre",
  ] as const;

  return (
    <fieldset className="sm:col-span-2">
      <legend className="text-[11px] font-semibold uppercase tracking-wider text-muted">
        {t("service")}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {keys.map((key) => {
          const label = t(`serviceOptions.${key}`);
          return (
            <label key={key} className="cursor-pointer">
              <input
                type="radio"
                name="service"
                value={label}
                className="peer sr-only"
              />
              <span className="inline-block rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink/75 transition-all duration-200 hover:border-ink/25 peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:font-medium peer-checked:text-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2">
                {label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function SubmitButton() {
  const t = useTranslations("contact.form");
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-accent px-7 py-4 text-base font-medium text-white shadow-card transition-all duration-300 hover:bg-accent-deep hover:shadow-lift active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
    >
      {pending && (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeOpacity="0.3"
          />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      )}
      {pending ? t("submitting") : t("submit")}
    </button>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  const t = useTranslations("contact.form.errors");
  if (!error) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 px-1 text-xs text-accent">
      {t(error)}
    </p>
  );
}

/** Alan + altındaki hata mesajını birlikte saran küçük yardımcı */
function FieldRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function DevisForm() {
  const t = useTranslations("contact.form");
  const tc = useTranslations("common");
  const [state, formAction] = useActionState(submitDevis, initialState);

  const errors = state.status === "error" ? state.fieldErrors : undefined;

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {state.status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="rounded-2xl border border-line bg-surface p-8 text-center shadow-card md:p-12"
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
              <CheckIcon className="h-7 w-7" />
            </span>
            <h3 className="mt-5 font-display text-2xl tracking-tight text-ink">
              {t("successTitle")}
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
              {t("successText")}
            </p>
            <a
              href={whatsappLink(tc("whatsappPrefill"))}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-medium text-white shadow-card transition-all hover:brightness-95"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {tc("whatsappCta")}
            </a>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            action={formAction}
            initial={false}
            exit={{ opacity: 0, y: -12 }}
            className="rounded-2xl border border-line bg-surface p-6 shadow-card md:p-9"
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <FieldRow>
                <Field
                  id="devis-name"
                  name="name"
                  label={t("name")}
                  placeholder={t("namePlaceholder")}
                  autoComplete="name"
                  required
                  error={errors?.name}
                  errorId="err-name"
                />
                <FieldError id="err-name" error={errors?.name} />
              </FieldRow>

              <FieldRow>
                <Field
                  id="devis-phone"
                  name="phone"
                  label={t("phone")}
                  placeholder={t("phonePlaceholder")}
                  type="tel"
                  autoComplete="tel"
                  error={errors?.contact}
                  errorId="err-contact"
                />
                <FieldError id="err-contact" error={errors?.contact} />
              </FieldRow>

              <FieldRow>
                <Field
                  id="devis-email"
                  name="email"
                  label={t("email")}
                  placeholder={t("emailPlaceholder")}
                  type="email"
                  autoComplete="email"
                  error={errors?.email}
                  errorId="err-email"
                />
                <FieldError id="err-email" error={errors?.email} />
              </FieldRow>

              <FieldRow>
                <Field
                  id="devis-city"
                  name="city"
                  label={t("city")}
                  placeholder={t("cityPlaceholder")}
                  autoComplete="address-level2"
                />
              </FieldRow>

              <ServiceChips />

              <FieldRow className="sm:col-span-2">
                <Field
                  id="devis-message"
                  name="message"
                  label={t("message")}
                  placeholder={t("messagePlaceholder")}
                  required
                  textarea
                  error={errors?.message}
                  errorId="err-message"
                />
                <FieldError id="err-message" error={errors?.message} />
              </FieldRow>
            </div>

            {/* Honeypot — botlara karşı, gerçek kullanıcılar görmez */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />

            {/* Gönderim başarısızsa müşteriyi kaybetme: doğrudan arama ve
                WhatsApp seçeneklerini öne çıkar. */}
            {state.status === "error" && !errors && (
              <div
                role="alert"
                aria-live="polite"
                className="mt-6 rounded-2xl border border-accent/25 bg-accent-soft/50 p-5"
              >
                <p className="text-sm leading-relaxed text-ink">
                  {t("errorGeneric")}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={siteConfig.phoneHref}
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-black active:scale-[0.98]"
                  >
                    <PhoneIcon className="h-4 w-4" />
                    {siteConfig.phoneDisplay}
                  </a>
                  <a
                    href={whatsappLink(tc("whatsappPrefill"))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:brightness-95 active:scale-[0.98]"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    {tc("whatsappCta")}
                  </a>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col items-start gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <SubmitButton />
              <p className="max-w-xs text-xs leading-relaxed text-muted">
                {t("privacy")}{" "}
                <Link href="/politique-de-confidentialite" className="underline underline-offset-2 transition-colors hover:text-accent">
                  {t("privacyLink")}
                </Link>
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
