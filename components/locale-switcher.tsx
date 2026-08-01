"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useParams } from "next/navigation";

export function LocaleSwitcher({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const t = useTranslations("header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function switchTo(next: string) {
    router.replace(
      // @ts-expect-error — dinamik segment paramları pathname ile birlikte geçiyor
      { pathname, params },
      { locale: next }
    );
  }

  const light = tone === "light";

  return (
    <div
      role="group"
      aria-label={t("localeSwitcherLabel")}
      className={`flex items-center gap-1 rounded-full border p-1 text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
        light ? "border-white/30 bg-white/10" : "border-line bg-surface/70"
      } ${className}`}
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-current={l === locale ? "true" : undefined}
          className={`rounded-full px-2.5 py-1 transition-colors duration-200 ${
            l === locale
              ? light
                ? "bg-white text-ink"
                : "bg-ink text-white"
              : light
                ? "text-white/75 hover:text-white"
                : "text-muted hover:text-ink"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
