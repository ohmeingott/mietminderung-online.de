import { mangelKategorien, type Mangel, type MangelKategorie } from "@/data/maengel";
import {
  kategorieSeo,
  mangelSeo,
  type KategorieSeo,
  type MangelSeo,
} from "@/data/seoContent";

export interface KategorieEntry {
  kategorie: MangelKategorie;
  seo: KategorieSeo;
  maengel: MangelEntry[];
}

export interface MangelEntry {
  mangel: Mangel;
  seo: MangelSeo;
  kategorie: MangelKategorie;
  kategorieSeo: KategorieSeo;
  /** "/mietminderung/<kategorie>/<mangel>" */
  path: string;
}

function buildIndex(): KategorieEntry[] {
  return mangelKategorien.map((kategorie) => {
    const catSeo = kategorieSeo[kategorie.id];
    if (!catSeo) {
      throw new Error(`Missing SEO content for category "${kategorie.id}"`);
    }

    const maengel = kategorie.maengel.map((mangel) => {
      const seo = mangelSeo[mangel.id];
      if (!seo) {
        throw new Error(`Missing SEO content for defect "${mangel.id}"`);
      }
      return {
        mangel,
        seo,
        kategorie,
        kategorieSeo: catSeo,
        path: `/mietminderung/${catSeo.slug}/${seo.slug}`,
      };
    });

    return { kategorie, seo: catSeo, maengel };
  });
}

export const kategorieIndex: KategorieEntry[] = buildIndex();

export const alleMaengel: MangelEntry[] = kategorieIndex.flatMap((c) => c.maengel);

export function getKategorieBySlug(slug: string): KategorieEntry | undefined {
  return kategorieIndex.find((entry) => entry.seo.slug === slug);
}

export function getMangelBySlug(
  kategorieSlug: string,
  mangelSlug: string
): MangelEntry | undefined {
  return getKategorieBySlug(kategorieSlug)?.maengel.find(
    (entry) => entry.seo.slug === mangelSlug
  );
}

export function kategoriePath(slug: string): string {
  return `/mietminderung/${slug}`;
}

/** Other defects in the same category, used for internal linking. */
export function verwandteMaengel(entry: MangelEntry, limit = 6): MangelEntry[] {
  const siblings = getKategorieBySlug(entry.kategorieSeo.slug)?.maengel ?? [];
  const others = siblings.filter((s) => s.mangel.id !== entry.mangel.id);
  if (others.length >= limit) return others.slice(0, limit);

  // Top up with the highest-quota defects from other categories so every page
  // links out to at least `limit` siblings.
  const filler = alleMaengel
    .filter(
      (m) =>
        m.kategorieSeo.slug !== entry.kategorieSeo.slug &&
        m.mangel.id !== entry.mangel.id
    )
    .sort((a, b) => b.mangel.minderung_typical - a.mangel.minderung_typical);

  return [...others, ...filler].slice(0, limit);
}

/** Defects with the highest typical quota - used on hub pages. */
export function topMaengel(limit = 12): MangelEntry[] {
  return [...alleMaengel]
    .sort((a, b) => b.mangel.minderung_typical - a.mangel.minderung_typical)
    .slice(0, limit);
}

/** Format a quota range for headlines and tables. */
export function formatSpanne(mangel: Mangel): string {
  return `${mangel.minderung_min}–${mangel.minderung_max} %`;
}

/** Monthly saving at a given gross rent, rounded to whole euros. */
export function minderungsBetrag(bruttowarmmiete: number, quote: number): number {
  return Math.round((bruttowarmmiete * quote) / 100);
}
