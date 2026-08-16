import { Link } from "@/i18n/navigation";
import { whatsappLink } from "@/lib/site-config";
import { Reveal } from "./reveal";
import { WhatsAppIcon } from "./icons";

type CtaBandProps = {
  title: string;
  subtitle?: string;
  primaryLabel: string;
  whatsappLabel?: string;
  whatsappPrefill?: string;
};

/** Sayfa sonlarında kullanılan koyu zeminli aksiyon bandı. */
export function CtaBand({
  title,
  subtitle,
  primaryLabel,
  whatsappLabel,
  whatsappPrefill,
}: CtaBandProps) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-14 text-center md:px-16 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(closest-side, #C03428 0%, transparent 100%)",
            }}
          />
          <h2 className="relative mx-auto max-w-2xl font-display text-4xl leading-[1.08] tracking-tight text-white md:text-5xl">
            {title}
          </h2>
          {subtitle && (
            <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70">
              {subtitle}
            </p>
          )}
          <div className="relative mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="btn-sweep inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-base font-medium text-white shadow-card transition-all duration-300 hover:shadow-lift active:scale-[0.98]"
            >
              {primaryLabel}
            </Link>
            {whatsappLabel && (
              <a
                href={whatsappLink(whatsappPrefill)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-base font-medium text-white transition-all duration-300 hover:border-white/50 active:scale-[0.98]"
              >
                <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
                {whatsappLabel}
              </a>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
