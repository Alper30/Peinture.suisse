import { getTranslations } from "next-intl/server";
import { identityRows, legalPendingFields } from "@/lib/legal-config";

/**
 * Bekleyen kimlik alanlarını build/dev çıktısında bir kez hatırlatır.
 * Modül kapsamında, çünkü bu sayfa üç dil için üç kez render ediliyor —
 * aynı satırı üç kez basmanın anlamı yok.
 */
const pending = legalPendingFields();
if (pending.length > 0) {
  console.warn(
    `\n📋 Yasal sayfalar: henüz doldurulmamış kimlik alanları\n` +
      `   ${pending.join(", ")}\n` +
      `   Boş oldukları için sayfada görünmüyorlar; doldurunca kendiliğinden gelirler.\n` +
      `   (bkz. lib/legal-config.ts)\n`
  );
}

/**
 * Yasal kimlik bilgileri — `lib/legal-config.ts` + `lib/site-config.ts`'ten
 * beslenir. Boş alanlar hiç render edilmez (bkz. `identityRows`).
 *
 * <dl> kullanılıyor çünkü bu bir tablo değil, etiket–değer çiftleri kümesi;
 * ekran okuyucular da böyle daha doğru okur.
 */
export async function IdentityTable() {
  const t = await getTranslations("legal.identity");

  const rows = identityRows({
    legalName: t("legalName"),
    legalForm: t("legalForm"),
    representative: t("representative"),
    address: t("address"),
    ide: t("ide"),
    vat: t("vat"),
    register: t("register"),
    phone: t("phone"),
    email: t("email"),
  });

  return (
    <dl className="mt-5 divide-y divide-line rounded-2xl border border-line bg-surface px-5 text-[15px]">
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-4"
        >
          <dt className="text-xs font-semibold uppercase tracking-widest text-muted sm:pt-0.5">
            {row.label}
          </dt>
          <dd className="text-ink">
            {row.href ? (
              <a href={row.href} className="legal-link">
                {row.value}
              </a>
            ) : (
              row.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
