import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/cta-band";
import { PostCard } from "@/components/blog/post-card";
import { getPosts } from "@/lib/blog";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("blog.title"),
    description: t("blog.description"),
    alternates: localeAlternates("/blog", locale),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blog");
  const tc = await getTranslations("common");
  const posts = getPosts(locale);

  const [featured, ...rest] = posts;

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-32 pb-12 md:px-8 md:pt-44">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
      </section>

      {posts.length === 0 ? (
        <section className="mx-auto max-w-6xl px-5 pb-20 md:px-8">
          <Reveal>
            <p className="rounded-2xl border border-line bg-surface px-6 py-8 text-center text-muted">
              {t("emptyState")}
            </p>
          </Reveal>
        </section>
      ) : (
        <>
          {/* Öne çıkan yazı */}
          <section className="mx-auto max-w-6xl px-5 pb-14 md:px-8">
            <Reveal>
              <PostCard post={featured} locale={locale} featured priority />
            </Reveal>
          </section>

          {/* Diğer yazılar */}
          {rest.length > 0 && (
            <section className="mx-auto max-w-6xl px-5 pb-20 md:px-8">
              <Reveal>
                <h2 className="mb-8 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  {t("allArticles")}
                  <span className="h-px flex-1 bg-line" aria-hidden />
                </h2>
              </Reveal>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((post, i) => (
                  <Reveal key={post.slug} delay={(i % 3) * 0.07}>
                    <PostCard post={post} locale={locale} />
                  </Reveal>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <CtaBand
        title={t("ctaBand.title")}
        subtitle={t("ctaBand.subtitle")}
        primaryLabel={t("ctaBand.cta")}
        whatsappLabel={tc("whatsappCta")}
        whatsappPrefill={tc("whatsappPrefill")}
      />
    </>
  );
}
