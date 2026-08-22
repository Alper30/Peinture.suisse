"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Wordmark } from "./wordmark";
import { LocaleSwitcher } from "./locale-switcher";
import {
  AccountDesktop,
  AccountMenuLink,
  AccountMobileIcon,
} from "./auth/header-account";
import { clientAreaEnabled } from "@/lib/site-config";

const navItems = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/realisations", key: "realisations" },
  { href: "/a-propos", key: "about" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

/**
 * Sticky header. Performans: bu bileşen layout'ta olduğu için HER sayfada
 * yükleniyor — animasyon kütüphanesi yerine rAF'li scroll dinleyicisi ve
 * CSS geçişleri kullanır. İlerleme çubuğu doğrudan DOM'a yazılır (render yok).
 */
export function SiteHeader() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const th = useTranslations("header");
  const ta = useTranslations("clientArea");
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(Math.max(y / max, 0), 1) : 0;
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${p})`;
        }
        setScrolled(y > 24);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Sayfa değişince mobil menüyü kapat.
  //
  // Effect değil, render sırasında ayarlama: React'in "bir değer değiştiğinde
  // state'i sıfırla" için önerdiği desen. Effect ile yapıldığında menü önce
  // yeni sayfayla birlikte bir kare AÇIK çizilir, sonra kapanırdı; burada
  // React aynı geçişte yeniden render edip DOM'a hiç yansıtmıyor.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Menü açıkken arka plan kaymasın
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Anasayfa hero'su koyu fotoğraf: scroll edilmemişken açık renkli header
  const onDark = pathname === "/" && !scrolled && !open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || open
            ? "border-b border-line bg-paper/90 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        {/* Scroll ilerleme çubuğu — transform doğrudan yazılır.
            DİKKAT: Tailwind'in scale-x-* sınıfları ayrı `scale` CSS özelliğini
            kullanır ve inline transform ile çarpışır; başlangıç değeri de
            bu yüzden inline verilir. */}
        <div
          ref={barRef}
          aria-hidden
          style={{ transform: "scaleX(0)" }}
          className="absolute inset-x-0 top-0 h-[3px] origin-left bg-accent"
        />

        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 md:px-8">
          <Link href="/" aria-label="Peinture Suisse" className="relative z-50">
            <Wordmark tone={onDark ? "light" : "dark"} />
          </Link>

          {/* Masaüstü menü */}
          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.slice(1, 6).map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`text-sm tracking-wide transition-colors duration-200 ${
                    onDark
                      ? active
                        ? "font-medium text-white"
                        : "text-white/70 hover:text-white"
                      : active
                        ? "font-medium text-ink"
                        : "text-muted hover:text-ink"
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {/* Girişli kullanıcıda Clerk avatarı, değilse sade bir giriş ikonu.
                İkonun kendisi metin taşımadığı için erişilebilir ad aria-label
                ile veriliyor; title da fare üzerindeyken aynı bilgiyi verir. */}
            {clientAreaEnabled && (
              <AccountDesktop onDark={onDark} label={ta("nav")} />
            )}
            <LocaleSwitcher tone={onDark ? "light" : "dark"} />
            <Link
              href="/contact"
              className="btn-sweep inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-card transition-all duration-300 hover:shadow-lift active:scale-[0.98]"
            >
              {tc("devisCta")}
            </Link>
          </div>

          {/* Mobil: giriş ikonu + menü butonu.
              İkon burada duruyor ki giriş için menüyü açmak gerekmesin.
              Header z-50, menü katmanı z-40 — menü açıkken de tıklanabilir. */}
          <div className="relative z-50 flex items-center gap-1 lg:hidden">
            {clientAreaEnabled && (
              <AccountMobileIcon onDark={onDark} label={ta("nav")} />
            )}

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? th("menuClose") : th("menuOpen")}
              aria-expanded={open}
              className="flex h-11 w-11 items-center justify-center"
            >
              <span className="relative block h-4 w-6">
                <span
                  className={`absolute top-0 left-0 block h-0.5 w-6 transition-all duration-300 ${
                    onDark ? "bg-white" : "bg-ink"
                  } ${open ? "translate-y-[7px] rotate-45" : ""}`}
                />
                <span
                  className={`absolute top-[7px] left-0 block h-0.5 w-6 transition-all duration-300 ${
                    onDark ? "bg-white" : "bg-ink"
                  } ${open ? "opacity-0" : "opacity-100"}`}
                />
                <span
                  className={`absolute bottom-0 left-0 block h-0.5 w-6 transition-all duration-300 ${
                    onDark ? "bg-white" : "bg-ink"
                  } ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobil tam ekran menü — header'ın DIŞINDA: backdrop-blur'lu ata eleman
          fixed konumun referansını bozduğu için kardeş olarak render edilir */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-40 flex flex-col overflow-y-auto bg-paper px-6 pt-24 pb-10 transition-opacity duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-2">
          {navItems.map((item, i) => (
            <div
              key={item.key}
              className={open ? "menu-item-in" : undefined}
              style={
                open ? { animationDelay: `${0.05 + i * 0.05}s` } : undefined
              }
            >
              <Link
                href={item.href}
                tabIndex={open ? 0 : -1}
                className="block py-2 font-display text-3xl tracking-tight text-ink"
              >
                {t(item.key)}
              </Link>
            </div>
          ))}
        </nav>

        <div
          className={`mt-auto flex flex-col gap-4 pt-10 ${open ? "menu-item-in" : ""}`}
          style={open ? { animationDelay: "0.4s" } : undefined}
        >
          {clientAreaEnabled && (
            <AccountMenuLink label={ta("nav")} tabIndex={open ? 0 : -1} />
          )}
          <LocaleSwitcher className="self-start" />
          <Link
            href="/contact"
            tabIndex={open ? 0 : -1}
            className="btn-sweep inline-flex items-center justify-center rounded-full bg-accent px-6 py-3.5 text-base font-medium text-white shadow-card"
          >
            {tc("devisCta")}
          </Link>
        </div>
      </div>
    </>
  );
}
