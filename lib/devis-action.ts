"use server";

import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";

export type DevisFormState = {
  status: "idle" | "success" | "error";
  /** Anahtarlar messages/*.json → contact.form.errors.* ile çevrilir */
  fieldErrors?: Partial<
    Record<"name" | "contact" | "email" | "message", string>
  >;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitDevis(
  _prev: DevisFormState,
  formData: FormData
): Promise<DevisFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  // Honeypot: gerçek kullanıcılar bu gizli alanı doldurmaz
  if (String(formData.get("company") ?? "")) {
    return { status: "success" };
  }

  const fieldErrors: DevisFormState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "nameRequired";
  if (!phone && !email) fieldErrors.contact = "contactRequired";
  if (email && !EMAIL_RE.test(email)) fieldErrors.email = "emailInvalid";
  if (!message) fieldErrors.message = "messageRequired";
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  const lines = [
    `Nom: ${name}`,
    `Téléphone: ${phone || "—"}`,
    `E-mail: ${email || "—"}`,
    `Localité: ${city || "—"}`,
    `Prestation: ${service || "—"}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  // `||` bilinçli: siteConfig.email boş dizge olabilir, `??` onu geçirmezdi
  const to = process.env.CONTACT_EMAIL_TO || siteConfig.email;
  /**
   * Gönderici, Resend'de doğrulanmış KENDİ alan adımız olmalı.
   * Resend'in paylaşımlı sandbox adresi (onboarding@resend.dev) yalnızca
   * Resend hesabının sahibi olan adrese teslim eder; başka her alıcıda 403
   * döner, `catch` onu yutar ve talep sessizce kaybolur. Ayrıca `From:` bize
   * ait olmayan bir alan adıysa DMARC hizalaması hiçbir zaman kendi alan
   * adımıza göre değerlendirilemez. Bu yüzden üretimde zorunlu tutuluyor;
   * yerel geliştirmede sandbox'a düşmesi sakıncasız.
   */
  const from =
    process.env.CONTACT_EMAIL_FROM ??
    (process.env.NODE_ENV === "production"
      ? undefined
      : "Peinture Suisse <onboarding@resend.dev>");

  // Yapılandırma eksikse gönderim imkânsız — sahte başarı yerine dürüst hata
  if (!apiKey || !to || !from) {
    const missing = !apiKey
      ? "RESEND_API_KEY"
      : !to
        ? "CONTACT_EMAIL_TO"
        : "CONTACT_EMAIL_FROM";
    // Müşteriye ASLA "gönderildi" denmez: sahte başarı, müşterinin boşuna
    // beklemesine ve talebin kaybolmasına yol açar. Bunun yerine
    // telefon/WhatsApp'a yönlendiren dürüst bir hata döneriz.
    //
    // Talep İÇERİĞİ loglanmaz: ad, telefon, e-posta ve serbest metin Vercel
    // runtime loglarına yazılırsa, projeye okuma erişimi olan herkes (ekip,
    // sonradan eklenen collaborator, kurulan her log drain) tüm müşteri
    // iletişim verisini log geçmişinden toplayabilir. nLPD/GDPR kapsamında.
    console.error(
      `[devis] ${missing} tanımlı değil` +
        ` — talep e-postaya GÖNDERİLEMEDİ (mesaj uzunluğu: ${lines.length})`
    );
    return { status: "error" };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      replyTo: email || undefined,
      subject: `Nouvelle demande de devis — ${name}`,
      text: lines,
    });
    return { status: "success" };
  } catch (error) {
    console.error("[devis] E-posta gönderilemedi:", error);
    return { status: "error" };
  }
}
