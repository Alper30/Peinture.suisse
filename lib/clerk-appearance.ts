// Not: Clerk Core 3'te `Appearance` tipi dışa aktarılmıyor (dahili olarak any).
// Sürüm değişimlerinde kırılmaması için tipi TypeScript'in çıkarımına bırakıyoruz;
// nesne `appearance` prop'una verildiğinde zaten doğrulanır.

/**
 * Clerk bileşenlerini sitenin tasarım diline uydurur.
 *
 * ÖNEMLİ: Clerk kendi dahili sınıflarını (cl-internal-*) yüksek özgüllükle
 * enjekte eder ve sade Tailwind sınıflarını ezer. Bu yüzden görünümü
 * değiştiren yardımcılarda Tailwind v4 önemlilik eki (`sinif!`) kullanılır.
 * Renkler `variables` üzerinden gider — orada eke gerek yoktur.
 */
export const clerkAppearance = {
  variables: {
    colorPrimary: "#c03428",
    colorText: "#1c1b18",
    colorTextSecondary: "#6b6860",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    colorInputText: "#1c1b18",
    colorDanger: "#c03428",
    colorSuccess: "#25d366",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-instrument-sans), ui-sans-serif, system-ui",
    fontSize: "0.95rem",
  },
  elements: {
    // Kartı biz sarmalıyoruz: Clerk'in kendi çerçevesi, gölgesi ve başlığı kapalı
    rootBox: "w-full!",
    cardBox: "w-full! shadow-none! border-0! rounded-none!",
    card: "bg-transparent! shadow-none! border-0! p-0! w-full! rounded-none!",
    header: "hidden!",
    // Alt bilgi: "zaten hesabın var mı" bağlantısını biz gösteriyoruz (tekrar olmasın)
    footer: "hidden!",

    socialButtonsBlockButton:
      "border! border-line! bg-surface! text-ink! h-12! rounded-xl! hover:border-ink/30! hover:bg-paper! transition-all! duration-200!",
    socialButtonsBlockButtonText: "font-medium! text-sm!",

    dividerLine: "bg-line!",
    dividerText: "text-muted! text-xs! uppercase! tracking-widest!",

    formFieldLabel:
      "text-xs! font-semibold! uppercase! tracking-wider! text-muted!",
    formFieldInput:
      "border! border-line! bg-surface! rounded-xl! h-12! px-4! text-ink! focus:border-accent! focus:ring-2! focus:ring-accent/15! transition-all! duration-200!",

    formButtonPrimary:
      "bg-accent! hover:bg-accent-deep! text-white! rounded-full! h-12! text-sm! font-medium! tracking-wide! normal-case! shadow-card! hover:shadow-lift! transition-all! duration-300! active:scale-[0.98]!",

    footerActionLink: "text-accent! hover:text-accent-deep! font-medium!",
    identityPreviewEditButton: "text-accent!",
    formResendCodeLink: "text-accent!",
    otpCodeFieldInput: "border-line! rounded-xl!",
  },
  layout: {
    socialButtonsPlacement: "top",
    socialButtonsVariant: "blockButton",
    showOptionalFields: false,
  },
};
