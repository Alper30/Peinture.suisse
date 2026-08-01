"use client";

import { useTranslations } from "next-intl";
import { whatsappLink } from "@/lib/site-config";
import { WhatsAppIcon } from "./icons";

/** Sabit WhatsApp butonu — giriş ve hover animasyonları saf CSS (bkz. globals.css). */
export function WhatsAppButton() {
  const t = useTranslations("common");

  return (
    <a
      href={whatsappLink(t("whatsappPrefill"))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsappAria")}
      className="wa-fab fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lift md:bottom-8 md:right-8"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
