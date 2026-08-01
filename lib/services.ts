export const services = [
  {
    slug: "peinture-interieure",
    key: "peintureInterieure",
    icon: "roller",
    image: "/images/rouleau.jpg",
    gallery: ["/images/int-sauge.jpg", "/images/int-boheme.jpg"],
  },
  {
    slug: "crepis-facades",
    key: "crepisFacades",
    icon: "facade",
    image: "/images/facade-crepi.jpg",
    gallery: ["/images/archi-blanche.jpg", "/images/hero-chantier-avant.jpg"],
  },
  {
    slug: "platrerie",
    key: "platrerie",
    icon: "trowel",
    image: "/images/platre-lissage.jpg",
    gallery: ["/images/int-galerie.jpg", "/images/hero-chantier-avant.jpg"],
  },
  {
    slug: "renovation",
    key: "renovation",
    icon: "home",
    image: "/images/interieur-salon.jpg",
    gallery: ["/images/hero-peintre-v2.jpg", "/images/hero-salon-apres.jpg"],
  },
] as const;

export type Service = (typeof services)[number];
export type ServiceSlug = Service["slug"];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
