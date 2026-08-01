import { Link } from "@/i18n/navigation";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "whatsapp";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-deep shadow-card hover:shadow-lift",
  secondary:
    "bg-ink text-white hover:bg-black shadow-card hover:shadow-lift",
  ghost:
    "bg-transparent text-ink border border-line hover:border-ink/40 hover:bg-surface",
  whatsapp:
    "bg-whatsapp text-white hover:brightness-95 shadow-card hover:shadow-lift",
};

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 ease-out active:scale-[0.98]";

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; children: ReactNode }) {
  return (
    <Link {...props} className={`${baseClass} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function ButtonAnchor({
  variant = "primary",
  className = "",
  children,
  ...props
}: ComponentProps<"a"> & { variant?: Variant; children: ReactNode }) {
  return (
    <a {...props} className={`${baseClass} ${variants[variant]} ${className}`}>
      {children}
    </a>
  );
}
