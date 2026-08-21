import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO (YYYY-MM-DD)
  cover?: string;
  /** messages/*.json → blog.categories.* anahtarı */
  category?: string;
  /** Dakika cinsinden tahmini okuma süresi */
  readingTime: number;
};

/** Ortalama 200 kelime/dakika; en az 1 dakika. */
function estimateReadingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function toMeta(slug: string, data: Record<string, unknown>, content: string) {
  return {
    slug,
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    cover: data.cover ? String(data.cover) : undefined,
    category: data.category ? String(data.category) : undefined,
    readingTime: estimateReadingTime(content),
  } satisfies PostMeta;
}

export function getPosts(locale: string): PostMeta[] {
  const dir = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      return toMeta(file.replace(/\.mdx$/, ""), data, content);
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * Yalnızca gerçekten var olabilecek dosya adları: küçük harf, rakam, tire.
 *
 * `slug` URL'den geliyor ve aşağıda doğrudan dosya yoluna giriyor. Bugün
 * sömürülebilir değil — Next yolu eşleştirmeden önce `..` parçalarını
 * normalleştiriyor ve uzantı `.mdx`'e sabitli, depoda da `content/blog/`
 * dışında tek bir `.mdx` yok.
 *
 * Buna rağmen kontrol ediliyor, çünkü asıl risk okuma değil ÇALIŞTIRMA:
 * okunan dosya `MDXRemote`'a veriliyor ve MDX sunucuda JSX olarak derlenip
 * çalıştırılıyor. `content/blog/` bir gün CMS, yükleme veya webhook ile
 * yazılabilir hale gelirse, yol denetimindeki en küçük gevşeklik dosya
 * okumaya değil uzaktan kod çalıştırmaya döner. Tek satırlık beyaz liste bu
 * kapıyı kalıcı olarak kapatıyor.
 */
const SLUG_RE = /^[a-z0-9-]+$/;

export function getPost(locale: string, slug: string) {
  if (!SLUG_RE.test(slug)) return null;

  const file = path.join(CONTENT_DIR, locale, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;

  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return { meta: toMeta(slug, data, content), content };
}

/**
 * Bir yazının komşularını döndürür (tarih sırasına göre önceki/sonraki)
 * ve aynı kategoriden ilgili yazıları.
 */
export function getPostContext(locale: string, slug: string) {
  const posts = getPosts(locale);
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return { previous: null, next: null, related: [] };

  const current = posts[index];
  const related = posts
    .filter((p) => p.slug !== slug && p.category === current.category)
    .slice(0, 2);

  return {
    // Liste yeniden eskiye sıralı: index+1 daha eski yazı
    next: posts[index - 1] ?? null,
    previous: posts[index + 1] ?? null,
    related:
      related.length > 0
        ? related
        : posts.filter((p) => p.slug !== slug).slice(0, 2),
  };
}
