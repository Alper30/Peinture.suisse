import { siteConfig, whatsappLink } from "@/lib/site-config";

/**
 * Yasal sayfaların kimlik verisi — TEK KAYNAK.
 *
 * Boş bırakılan alan sayfada HİÇ render edilmez (bkz. `identityRows`).
 * Bu bilinçli: yarım doldurulmuş bir "mentions légales" yerine eksik satırın
 * hiç görünmemesi tercih edilir; "[À COMPLÉTER]" gibi bir metnin canlıya
 * sızması hem güven kırar hem LCD art. 3 al. 1 let. s açısından kötüdür.
 *
 * DURUM (2026-08-02): şirket henüz kurulmadı, profesyonel e-posta da yok.
 * Bu yüzden aşağıdaki alanlar bilerek boş ve sayfada görünmüyor; site şu an
 * telefon + WhatsApp + iletişim formu üzerinden ulaşılabilir durumda.
 *
 * Şirket kurulunca doldurulacaklar:
 *   - legalName        (raison sociale — sicilde/işletmede yazan tam ad)
 *   - legalForm        ("Raison individuelle" | "Sàrl" | "SA")
 *   - representative   (sorumlu kişi / yetkili müdür)
 *   - ideNumber        (CHE-xxx.xxx.xxx)
 *   - vatNumber        (TVA mükellefiyseniz)
 *   - commercialRegister (Sàrl/SA için zorunlu)
 *   - streetAddress    (site-config.ts içinde)
 *   - email            (site-config.ts içinde)
 * `legalPendingFields()` bunları izler ve build sırasında hatırlatma basar.
 */
export const legalConfig = {
  /** Raison sociale — ör. "Peinture Suisse Sàrl" veya "Jean Dupont, Peinture Suisse" */
  legalName: "",
  /** Hukuki biçim — ör. "Sàrl", "SA", "Raison individuelle" */
  legalForm: "",
  /** Sorumlu kişi — ör. "Jean Dupont, associé gérant" */
  representative: "",
  /** İşletme kimlik numarası — "CHE-123.456.789" */
  ideNumber: "",
  /** TVA numarası — genelde "CHE-123.456.789 TVA". Muafsanız boş bırakın. */
  vatNumber: "",
  /** Ticaret sicili — Sàrl/SA için zorunlu. Ör. "Registre du commerce du canton de Vaud" */
  commercialRegister: "",

  /** Barındırma sağlayıcısı — gizlilik politikasında da geçer */
  host: {
    name: "Vercel Inc.",
    country: "États-Unis",
    url: "https://vercel.com",
  },

  /**
   * Metinlerin son güncellenme tarihi (ISO). İçeriği her değiştirdiğinizde
   * güncelleyin — LPD art. 19 bilgilendirme yükümlülüğü açısından önemli.
   */
  lastUpdated: "2026-08-02",
} as const;

/** Kanuni kimlik satırları — yalnızca dolu olanlar döner. */
export function identityRows(labels: {
  legalName: string;
  legalForm: string;
  representative: string;
  address: string;
  ide: string;
  vat: string;
  register: string;
  phone: string;
  email: string;
}): { label: string; value: string; href?: string }[] {
  const { address } = siteConfig;
  const fullAddress = [
    address.streetAddress,
    [address.postalCode, address.addressLocality].filter(Boolean).join(" "),
    "Suisse",
  ]
    .filter(Boolean)
    .join(", ");

  const rows: { label: string; value: string; href?: string }[] = [
    { label: labels.legalName, value: legalConfig.legalName },
    { label: labels.legalForm, value: legalConfig.legalForm },
    { label: labels.representative, value: legalConfig.representative },
    { label: labels.address, value: address.streetAddress ? fullAddress : "" },
    { label: labels.ide, value: legalConfig.ideNumber },
    { label: labels.vat, value: legalConfig.vatNumber },
    { label: labels.register, value: legalConfig.commercialRegister },
    {
      label: labels.phone,
      value: siteConfig.phoneDisplay,
      href: siteConfig.phoneHref,
    },
    // Etiket üç dilde de aynı yazıldığı için çeviri dosyasına girmiyor.
    // E-posta yokken asıl yazılı iletişim kanalı bu — LCD art. 3 al. 1 let. s'in
    // aradığı "hızlı ve sorunsuz ulaşılabilirlik" açısından önemli.
    {
      label: "WhatsApp",
      value: siteConfig.whatsappDisplay,
      href: whatsappLink(),
    },
    {
      label: labels.email,
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
    },
  ];

  return rows.filter((r) => r.value.trim().length > 0);
}

/**
 * Henüz doldurulmamış kimlik alanları (boş dizi = tamam).
 * Sıra önemli: en üstteki, yayına çıkmadan önce en çok işe yarayan alan.
 */
export function legalPendingFields(): string[] {
  const pending: string[] = [];
  if (!siteConfig.email) pending.push("siteConfig.email");
  if (!legalConfig.legalName) pending.push("legalConfig.legalName");
  if (!legalConfig.representative) pending.push("legalConfig.representative");
  if (!siteConfig.address.streetAddress)
    pending.push("siteConfig.address.streetAddress");
  return pending;
}
