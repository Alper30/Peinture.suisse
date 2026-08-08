import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import {
  LegalDocument,
  legalMetadata,
} from "@/components/legal/legal-document";
import { IdentityTable } from "@/components/legal/identity-table";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return legalMetadata(
    "confidentialite",
    "/politique-de-confidentialite",
    locale
  );
}

export default async function PolitiqueConfidentialitePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalDocument
      doc="confidentialite"
      locale={locale}
      slots={{ identity: <IdentityTable /> }}
    />
  );
}
