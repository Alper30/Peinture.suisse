"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { submitDevis, type DevisFormState } from "@/lib/devis-action";
import { whatsappLink } from "@/lib/site-config";
import { CheckIcon, WhatsAppIcon } from "./icons";

const initialState: DevisFormState = { status: "idle" };

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted/60 outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/15";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted";

function SubmitButton() {
  const t = useTranslations("contact.form");
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-full bg-accent px-7 py-3.5 text-base font-medium text-white shadow-card transition-all duration-300 hover:bg-accent-deep hover:shadow-lift active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {pending ? t("submitting") : t("submit")}
    </button>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  const t = useTranslations("contact.form.errors");
  if (!error) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-accent">
      {t(error)}
    </p>
  );
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
              <div>
                <label htmlFor="devis-name" className={labelClass}>
                  {t("name")} *
                </label>
                <input
                  id="devis-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder={t("namePlaceholder")}
                  aria-describedby="err-name"
                  className={inputClass}
                />
                <FieldError id="err-name" error={errors?.name} />
              </div>
              <div>
                <label htmlFor="devis-phone" className={labelClass}>
                  {t("phone")}
                </label>
                <input
                  id="devis-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder={t("phonePlaceholder")}
                  aria-describedby="err-contact"
                  className={inputClass}
                />
                <FieldError id="err-contact" error={errors?.contact} />
              </div>
              <div>
                <label htmlFor="devis-email" className={labelClass}>
                  {t("email")}
                </label>
                <input
                  id="devis-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t("emailPlaceholder")}
                  aria-describedby="err-email"
                  className={inputClass}
                />
                <FieldError id="err-email" error={errors?.email} />
              </div>
              <div>
                <label htmlFor="devis-city" className={labelClass}>
                  {t("city")}
                </label>
                <input
                  id="devis-city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  placeholder={t("cityPlaceholder")}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="devis-service" className={labelClass}>
                  {t("service")}
                </label>
                <select
                  id="devis-service"
                  name="service"
                  defaultValue=""
                  className={`${inputClass} appearance-none`}
                >
                  <option value="" disabled>
                    {t("servicePlaceholder")}
                  </option>
                  {(
                    [
                      "peintureInterieure",
                      "crepisFacades",
                      "platrerie",
                      "renovation",
                      "autre",
                    ] as const
                  ).map((key) => (
                    <option key={key} value={t(`serviceOptions.${key}`)}>
                      {t(`serviceOptions.${key}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="devis-message" className={labelClass}>
                  {t("message")} *
                </label>
                <textarea
                  id="devis-message"
                  name="message"
                  rows={5}
                  placeholder={t("messagePlaceholder")}
                  aria-describedby="err-message"
                  className={`${inputClass} resize-y`}
                />
                <FieldError id="err-message" error={errors?.message} />
              </div>
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

            {state.status === "error" && !errors && (
              <p role="alert" className="mt-5 text-sm text-accent">
                {t("errorGeneric")}
              </p>
            )}

            <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SubmitButton />
              <p className="max-w-xs text-xs leading-relaxed text-muted">
                {t("privacy")}
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
