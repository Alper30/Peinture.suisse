"use server";

import nodemailer from "nodemailer";
import { siteConfig } from "@/lib/site-config";

export type DevisFormState = {
  status: "idle" | "success" | "error";
  /** Anahtarlar messages/*.json → contact.form.errors.* ile çevrilir */
  fieldErrors?: Partial<
    Record<"name" | "contact" | "email" | "message", string>
  >;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * SMTP varsayılanları — alan adının DNS bölgesindeki SRV kayıtlarından okundu
 * (`_submissions._tcp` → 465, `_submission._tcp` → 587, RFC 6186).
 *
 * 465 (implicit TLS) tercih edildi, 587 (STARTTLS) değil: 465'te bağlantı
 * doğrudan şifreli açılır. STARTTLS düz metin başlayıp yükseltme ister — bu
 * hem fazladan gidiş-geliş hem de yükseltme sessizce başarısız olursa şifresiz
 * gönderim riskidir.
 *
 * Env ile ezilebilir: sağlayıcı değişirse kod değişmez.
 */
const SMTP_HOST = process.env.SMTP_HOST ?? "mail.infomaniak.com";
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 465);

/**
 * Serverless'ta zaman aşımları KRİTİK.
 *
 * Takılan bir SMTP bağlantısı, işlevin tüm süresini yakar: kullanıcı boş
 * ekrana bakar, sonunda platform isteği keser ve elimizde ne başarı ne de
 * anlamlı bir hata kalır. Bu yüzden üç aşamanın her biri ayrı sınırlanıyor.
 *
 * Değerler bilinçli olarak kısa: kullanıcı formun karşısında bekliyor.
 * Geçici bir yavaşlıkta hatalı "gönderilemedi" demek, kullanıcıyı 30 saniye
 * bekletmekten iyidir — dürüst hata zaten telefon/WhatsApp'a yönlendiriyor.
 */
const TIMEOUTS = {
  /** TCP bağlantısı kurulana kadar */
  connectionTimeout: 8_000,
  /** Sunucunun ilk karşılama (greeting) mesajı */
  greetingTimeout: 8_000,
  /** Komutlar arası bekleme */
  socketTimeout: 12_000,
} as const;

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

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  // `||` bilinçli: siteConfig.email boş dizge olabilir, `??` onu geçirmezdi
  const to = process.env.CONTACT_EMAIL_TO || siteConfig.email;
  /**
   * Gönderici, SMTP'de KİMLİK DOĞRULANAN posta kutusuyla aynı olmalı.
   * Infomaniak (ve ciddi her sağlayıcı) başkası adına gönderimi reddeder.
   * Bu yüzden varsayılan doğrudan `SMTP_USER` — ayrıca yazmaya gerek yok,
   * yanlış yazılıp DMARC hizalamasının bozulması da imkânsız hale gelir.
   */
  const from = process.env.CONTACT_EMAIL_FROM || user;

  // Yapılandırma eksikse gönderim imkânsız — sahte başarı yerine dürüst hata
  if (!user || !pass || !to || !from) {
    const missing = !user
      ? "SMTP_USER"
      : !pass
        ? "SMTP_PASSWORD"
        : "CONTACT_EMAIL_TO";
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
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      // 465 → implicit TLS. Başka bir port verilirse STARTTLS'e düşer.
      secure: SMTP_PORT === 465,
      auth: { user, pass },
      ...TIMEOUTS,
    });

    await transporter.sendMail({
      from,
      to,
      // Yanıtla'ya basınca doğrudan müşteriye gitsin
      replyTo: email || undefined,
      subject: `Nouvelle demande de devis — ${name}`,
      text: lines,
    });

    return { status: "success" };
  } catch (error) {
    // Hata nesnesi müşteri verisi taşımaz (SMTP kodu/mesajı), loglanabilir.
    console.error("[devis] E-posta gönderilemedi:", error);
    return { status: "error" };
  }
}
