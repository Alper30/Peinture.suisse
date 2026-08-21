"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { Link } from "@/i18n/navigation";
import { UserIcon } from "@/components/icons";

/**
 * Header'daki müşteri alanı bağlantıları.
 *
 * Neden ayrı dosya: `useAuth()` yalnızca `<ClerkProvider>` içinde çağrılabilir
 * ve müşteri alanı kapalıyken kök layout provider'ı hiç render etmiyor
 * (bkz. app/[locale]/layout.tsx). Hook'lar koşullu çağrılamadığı için, hook'u
 * SiteHeader'ın gövdesinde bırakırsak kapalı durumda TÜM sayfalar prerender
 * sırasında patlar — build'de bunu bizzat gördük.
 *
 * Bileşene taşındığında hook yalnızca bileşen render edildiğinde çalışır;
 * `clientAreaEnabled` kapalıysa SiteHeader bunları hiç render etmez, provider
 * da gerekmez. Bkz. lib/site-config.ts
 *
 * `label` prop olarak geçiliyor: çeviriyi zaten okuyan SiteHeader'a bir kez
 * daha `useTranslations` çağırtmamak için.
 */

/** Masaüstü: girişliyse Clerk avatarı, değilse sade giriş ikonu */
export function AccountDesktop({
  onDark,
  label,
}: {
  onDark: boolean;
  label: string;
}) {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />;
  }

  return (
    <Link
      href="/connexion"
      aria-label={label}
      title={label}
      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 ${
        onDark
          ? "text-white/70 hover:bg-white/10 hover:text-white"
          : "text-muted hover:bg-ink/5 hover:text-ink"
      }`}
    >
      <UserIcon className="h-5 w-5" />
    </Link>
  );
}

/** Mobil header ikonu — menüyü açmadan giriş yapılabilsin diye dışarıda */
export function AccountMobileIcon({
  onDark,
  label,
}: {
  onDark: boolean;
  label: string;
}) {
  const { isSignedIn } = useAuth();

  return (
    <Link
      href={isSignedIn ? "/espace-client" : "/connexion"}
      aria-label={label}
      className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 ${
        onDark ? "text-white/80" : "text-muted"
      }`}
    >
      <UserIcon className="h-5 w-5" />
    </Link>
  );
}

/** Mobil menünün altındaki metin bağlantısı */
export function AccountMenuLink({
  label,
  tabIndex,
}: {
  label: string;
  tabIndex: number;
}) {
  const { isSignedIn } = useAuth();

  return (
    <Link
      href={isSignedIn ? "/espace-client" : "/connexion"}
      tabIndex={tabIndex}
      className="text-sm font-medium text-muted"
    >
      {label}
    </Link>
  );
}
