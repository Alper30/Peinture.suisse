import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRightIcon } from "@/components/icons";
import type { PostMeta } from "@/lib/blog";

type PostCardProps = {
  post: PostMeta;
  locale: string;
  /** Öne çıkan kart: yatay düzen, daha büyük tipografi */
  featured?: boolean;
  priority?: boolean;
};

/** Tarih + okuma süresi + kategori rozeti — kartlarda ve makale başında ortak kullanılır. */
export async function PostMetaLine({
  post,
  locale,
  tone = "dark",
}: {
  post: PostMeta;
  locale: string;
  tone?: "dark" | "light";
}) {
  const t = await getTranslations("blog");
  const formatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const dim = tone === "light" ? "text-white/70" : "text-muted";

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
      {post.category && (
        <span className="rounded-full bg-accent-soft px-3 py-1 font-medium tracking-wide text-accent">
          {t(`categories.${post.category}`)}
        </span>
      )}
      {post.date && (
        <time dateTime={post.date} className={`tabular ${dim}`}>
          {formatter.format(new Date(post.date))}
        </time>
      )}
      <span aria-hidden className={dim}>
        ·
      </span>
      <span className={`tabular ${dim}`}>
        {t("readingTime", { min: post.readingTime })}
      </span>
    </div>
  );
}

export async function PostCard({
  post,
  locale,
  featured = false,
  priority = false,
}: PostCardProps) {
  const t = await getTranslations("blog");

  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group grid overflow-hidden rounded-3xl border border-line bg-surface shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-lift lg:grid-cols-2"
      >
        {post.cover && (
          <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[26rem]">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              priority={priority}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <span className="absolute left-5 top-5 rounded-full bg-ink/85 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              {t("featured")}
            </span>
          </div>
        )}
        <div className="flex flex-col justify-center p-8 md:p-12">
          <PostMetaLine post={post} locale={locale} />
          <h2 className="mt-5 font-display text-3xl leading-[1.12] tracking-tight text-ink md:text-4xl">
            {post.title}
          </h2>
          <p className="mt-4 leading-relaxed text-muted">{post.description}</p>
          <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-accent">
            {t("readArticle")}
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
    >
      {post.cover && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={post.cover}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-7">
        <PostMetaLine post={post} locale={locale} />
        <h3 className="mt-4 font-display text-2xl leading-snug tracking-tight text-ink">
          {post.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
          {post.description}
        </p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent">
          {t("readArticle")}
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
