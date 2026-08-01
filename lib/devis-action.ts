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
  const to = process.env.CONTACT_EMAIL_TO ?? siteConfig.email;

  if (!apiKey) {
    // E-posta gönderimi yapılandırılmamış. Müşteriye ASLA "gönderildi" denmez:
    // sahte başarı, müşterinin boşuna beklemesine ve talebin kaybolmasına yol açar.
    // Bunun yerine telefon/WhatsApp'a yönlendiren dürüst bir hata döneriz.
    console.error(
      "[devis] RESEND_API_KEY tanımlı değil — talep e-postaya GÖNDERİLEMEDİ:\n" +
        lines
    );
    return { status: "error" };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "Peinture Suisse <onboarding@resend.dev>",
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
