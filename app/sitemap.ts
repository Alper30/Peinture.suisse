import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { services } from "@/lib/services";
import { getPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

const staticRoutes = [
  "/",
  "/services",
  "/realisations",
  "/a-propos",
  "/contact",
  "/blog",
  "/mentions-legales",
  "/politique-de-confidentialite",
  "/cookies",
  "/conditions-generales",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const hrefs = [
    ...staticRoutes,
    ...services.map((s) => `/services/${s.slug}`),
    ...getPosts(routing.defaultLocale).map((p) => `/blog/${p.slug}`),
  ];

  return hrefs.flatMap((href) =>
    routing.locales.map((locale) => ({
      url: siteConfig.baseUrl + getPathname({ locale, href }),
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [
            l,
            siteConfig.baseUrl + getPathname({ locale: l, href }),
          ])
        ),
      },
    }))
  );
}
