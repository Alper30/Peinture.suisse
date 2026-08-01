import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { PostCard, PostMetaLine } from "@/components/blog/post-card";
import { ArrowRightIcon } from "@/components/icons";
import { getPost, getPosts, getPostContext } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";
import { localeAlternates } from "@/lib/seo";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getPosts(locale).map((post) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(locale, slug);
  if (!post) return {};

  return {
    title: post.meta.title,
    description: post.meta.description,
    alternates: localeAlternates(`/blog/${slug}`),
    openGraph: {
      type: "article",
      title: post.meta.title,
      description: post.meta.description,
      publishedTime: post.meta.date,
      images: post.meta.cover ? [post.meta.cover] : undefined,
    },
  };
}

/* MDX içeriği için tipografi — okunabilir ölçü, net hiyerarşi */
const mdxComponents = {
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      className="mt-14 font-display text-3xl leading-tight tracking-tight text-ink md:text-4xl"
      {...props}
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3
      className="mt-10 font-display text-xl tracking-tight text-ink md:text-2xl"
      {...props}
    />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="mt-5 leading-[1.75] text-ink/80 md:text-lg" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul
      className="mt-5 list-disc space-y-2.5 pl-5 leading-[1.75] text-ink/80 marker:text-accent md:text-lg"
      {...props}
    />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol
      className="mt-5 list-decimal space-y-2.5 pl-5 leading-[1.75] text-ink/80 marker:font-medium marker:text-accent md:text-lg"
      {...props}
    />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-semibold text-ink" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="mt-8 border-l-2 border-accent bg-accent-soft/40 py-4 pl-6 pr-4 font-display text-xl italic leading-snug text-ink/85"
      {...props}
    />
  ),
  hr: () => <hr className="mt-12 border-line" />,
};

export default async function BlogPostPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const post = getPost(locale, slug);
  if (!post) notFound();

  setRequestLocale(locale);

  const t = await getTranslations("blog");
  const tc = await getTranslations("common");
  const { previous, next, related } = getPostContext(locale, slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.meta.title,
    description: post.meta.description,
    datePublished: post.meta.date,
    inLanguage: locale,
    image: post.meta.cover
      ? `${siteConfig.baseUrl}${post.meta.cover}`
      : undefined,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.baseUrl}/${locale}/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl px-5 pt-32 pb-16 md:px-8 md:pt-44">
        <Link
          href="/blog"
          className="text-sm font-medium text-accent transition-colors hover:text-accent-deep"
        >
          {t("backToBlog")}
        </Link>

        <header className="mt-7">
          <PostMetaLine post={post.meta} locale={locale} />
          <h1 className="mt-5 font-display text-4xl leading-[1.08] tracking-tight text-ink md:text-5xl">
            {post.meta.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted md:text-xl">
            {post.meta.description}
          </p>
          {post.meta.cover && (
            <div className="relative mt-9 aspect-[16/9] w-full overflow-hidden rounded-3xl shadow-card">
              <Image
                src={post.meta.cover}
                alt={post.meta.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}
        </header>

        <div className="mt-10 border-t border-line pt-2">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        {/* Önceki / sonraki */}
        {(previous || next) && (
          <nav
            aria-label={t("allArticles")}
            className="mt-16 grid gap-4 border-t border-line pt-8 sm:grid-cols-2"
          >
            {previous ? (
              <Link
                href={`/blog/${previous.slug}`}
                className="group rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card"
              >
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted">
                  <ArrowRightIcon
                    className="h-4 w-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1"
                    aria-hidden
                  />
                  {t("previousArticle")}
                </span>
                <span className="mt-3 block font-display text-lg leading-snug text-ink">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <span aria-hidden />
            )}
            {next && (
              <Link
                href={`/blog/${next.slug}`}
                className="group rounded-2xl border border-line bg-surface p-6 text-right transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card"
              >
                <span className="flex items-center justify-end gap-2 text-xs font-semibold uppercase tracking-widest text-muted">
                  {t("nextArticle")}
                  <ArrowRightIcon
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
                <span className="mt-3 block font-display text-lg leading-snug text-ink">
                  {next.title}
                </span>
              </Link>
            )}
          </nav>
        )}
      </article>

      {/* İlgili yazılar */}
      {related.length > 0 && (
        <section className="bg-surface py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <Reveal>
              <h2 className="mb-8 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                {t("relatedTitle")}
                <span className="h-px flex-1 bg-line" aria-hidden />
              </h2>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-2">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.07}>
                  <PostCard post={p} locale={locale} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="pt-16 md:pt-20">
        <CtaBand
          title={t("ctaBand.title")}
          subtitle={t("ctaBand.subtitle")}
          primaryLabel={t("ctaBand.cta")}
          whatsappLabel={tc("whatsappCta")}
          whatsappPrefill={tc("whatsappPrefill")}
        />
      </div>
    </>
  );
}
