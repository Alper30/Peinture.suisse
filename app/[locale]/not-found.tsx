import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/button-link";

export default function NotFoundPage() {
  const t = useTranslations("notFound");

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 pt-24 text-center">
      <p className="font-display text-7xl text-accent">404</p>
      <h1 className="mt-4 font-display text-3xl tracking-tight">{t("title")}</h1>
      <p className="mt-3 max-w-sm text-muted">{t("text")}</p>
      <ButtonLink href="/" variant="secondary" className="mt-8">
        {t("backHome")}
      </ButtonLink>
    </div>
  );
}
