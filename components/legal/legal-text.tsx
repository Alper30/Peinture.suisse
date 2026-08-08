import { Fragment, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";

/**
 * Çeviri dosyalarındaki düz metin içinde iki işaretleme desteklenir:
 *   `[etiket](hedef)` → bağlantı
 *   `**metin**`       → vurgu (<strong>)
 *
 * Neden markdown kütüphanesi değil: yasal metinlerde ihtiyacımız olan
 * zenginleştirme bundan ibaret. MDX/markdown paketi eklemek 3 dil × 4 sayfa
 * için gereksiz bir bağımlılık ve bundle maliyeti olurdu. Çevirmen de bu iki
 * kalıbı bozmadan rahatça çalışabilir.
 *
 * Site içi yollar (`/...`) next-intl `Link`'i ile render edilir — böylece dil
 * öneki (/fr, /de, /en) otomatik korunur. Dış bağlantılar yeni sekmede açılır.
 */
/**
 * `matchAll` kullanılıyor, `exec` döngüsü değil: `exec` global regex'in
 * `lastIndex` alanını değiştirir; modül kapsamındaki bir regex ise tüm
 * render'lar arasında paylaşılır. `matchAll` regex'i içeride klonlar, yani
 * paylaşılan durum hiç mutasyona uğramaz (React Compiler de bunu şart koşuyor).
 */
const TOKEN_RE = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;

export function LegalText({ children }: { children: string }): ReactNode {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of children.matchAll(TOKEN_RE)) {
    const [full, label, href, bold] = match;
    const index = match.index;

    if (index > lastIndex) {
      nodes.push(children.slice(lastIndex, index));
    }

    if (bold !== undefined) {
      nodes.push(
        <strong key={`b-${index}`} className="font-semibold text-ink">
          {bold}
        </strong>
      );
    } else if (href.startsWith("/")) {
      nodes.push(
        <Link key={`l-${index}`} href={href} className="legal-link">
          {label}
        </Link>
      );
    } else {
      const isExternal = href.startsWith("http");
      nodes.push(
        <a
          key={`a-${index}`}
          href={href}
          className="legal-link"
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {label}
        </a>
      );
    }

    lastIndex = index + full.length;
  }

  if (lastIndex < children.length) {
    nodes.push(children.slice(lastIndex));
  }

  return (
    <>
      {nodes.map((node, i) => (
        <Fragment key={i}>{node}</Fragment>
      ))}
    </>
  );
}
