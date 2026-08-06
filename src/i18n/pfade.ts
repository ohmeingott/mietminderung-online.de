import { locales, type Locale } from "./translations";

/**
 * Where every translatable page lives in every language's URL space.
 *
 * The German path is the identity of a page everywhere else in the codebase.
 * `localeHref("tr", "/ratgeber/maengelanzeige-schreiben")` is how a Turkish
 * link gets built, and `splitLocalePath("/tr/rehber/ayip-bildirimi-yazma")`
 * maps back to the German path. Only the two edges translate; no component,
 * no schema emitter and no sitemap entry has to know that the URLs differ per
 * language.
 *
 * Slugs live here rather than next to the translated prose in
 * `src/i18n/ratgeber/`, because a slug is a routing fact, not content. Keeping
 * them here lets the router and `generateStaticParams` answer "what URLs
 * exist" without pulling 280.000 characters of article text into the module
 * graph, and lets `check:i18n` verify them without loading any of it.
 *
 * Adding a page means adding one row. The per-locale URL maps below are
 * derived, so nothing else changes.
 */

/**
 * URL segments that differ per language, keyed by the German segment.
 *
 * Non-Latin scripts are deliberate. Browsers and search engines display these
 * decoded, and a transliterated `rekomendacii` would throw away the only
 * keyword the URL carries — which is the whole reason the paths are
 * translated at all. They are percent-encoded only when copied as raw text.
 */
export const SEGMENTE = {
  ratgeber: {
    de: "ratgeber",
    en: "guides",
    tr: "rehber",
    ar: "دليل",
    ru: "рекомендации",
    pl: "poradnik",
    uk: "порадник",
  },
} as const satisfies Record<string, Record<Locale, string>>;

export type UebersetztesSegment = keyof typeof SEGMENTE;

/**
 * The guide slugs, keyed by the German slug in `src/data/ratgeber.ts`.
 *
 * Diacritics are stripped in the Latin-script languages (`ł` → `l`, `ş` → `s`)
 * because that is what those markets' URLs look like and what people type.
 * Cyrillic and Arabic keep their script — there is no reduced form of those
 * that a reader would recognise.
 */
export const RATGEBER_SLUGS = {
  "maengelanzeige-schreiben": {
    de: "maengelanzeige-schreiben",
    en: "defect-notice-to-landlord",
    tr: "ayip-bildirimi-yazma",
    ar: "كتابة-اخطار-العيوب",
    ru: "уведомление-о-недостатках",
    pl: "zgloszenie-wad-wynajmujacemu",
    uk: "повідомлення-про-недоліки",
  },
  "mietminderung-berechnen": {
    de: "mietminderung-berechnen",
    en: "calculate-rent-reduction",
    tr: "kira-indirimi-hesaplama",
    ar: "حساب-تخفيض-الايجار",
    ru: "расчет-снижения-арендной-платы",
    pl: "obliczanie-obnizki-czynszu",
    uk: "розрахунок-зниження-орендної-плати",
  },
  "miete-unter-vorbehalt-zahlen": {
    de: "miete-unter-vorbehalt-zahlen",
    en: "paying-rent-under-protest",
    tr: "kirayi-ihtirazi-kayitla-odeme",
    ar: "دفع-الايجار-مع-التحفظ",
    ru: "оплата-аренды-с-оговоркой",
    pl: "placenie-czynszu-z-zastrzezeniem",
    uk: "оплата-оренди-із-застереженням",
  },
  "mietminderung-rueckwirkend": {
    de: "mietminderung-rueckwirkend",
    en: "retroactive-rent-reduction",
    tr: "geriye-donuk-kira-indirimi",
    ar: "تخفيض-الايجار-بأثر-رجعي",
    ru: "снижение-арендной-платы-задним-числом",
    pl: "obnizka-czynszu-wstecz",
    uk: "зниження-орендної-плати-заднім-числом",
  },
  "mietminderung-ausschluss": {
    de: "mietminderung-ausschluss",
    en: "when-rent-reduction-is-excluded",
    tr: "kira-indiriminin-istisnalari",
    ar: "استثناءات-تخفيض-الايجار",
    ru: "исключения-снижения-арендной-платы",
    pl: "wylaczenie-obnizki-czynszu",
    uk: "винятки-зниження-орендної-плати",
  },
  "mietminderung-fehler": {
    de: "mietminderung-fehler",
    en: "common-rent-reduction-mistakes",
    tr: "kira-indiriminde-sik-yapilan-hatalar",
    ar: "اخطاء-تخفيض-الايجار",
    ru: "типичные-ошибки-снижения-платы",
    pl: "bledy-przy-obnizce-czynszu",
    uk: "помилки-при-зниженні-орендної-плати",
  },
  "maengelanzeige-zustellen": {
    de: "maengelanzeige-zustellen",
    en: "serving-a-defect-notice",
    tr: "ayip-bildirimini-teblig-etme",
    ar: "تسليم-اخطار-العيوب",
    ru: "вручение-уведомления-о-недостатках",
    pl: "doreczenie-zgloszenia-wad",
    uk: "вручення-повідомлення-про-недоліки",
  },
  "vermieter-reagiert-nicht": {
    de: "vermieter-reagiert-nicht",
    en: "landlord-not-responding",
    tr: "ev-sahibi-cevap-vermiyor",
    ar: "المؤجر-لا-يرد",
    ru: "арендодатель-не-отвечает",
    pl: "wynajmujacy-nie-odpowiada",
    uk: "орендодавець-не-відповідає",
  },
} as const satisfies Record<string, Record<Locale, string>>;

/** The German slug of every guide that has translated URLs. */
export type RatgeberSlug = keyof typeof RATGEBER_SLUGS;

export function istRatgeberSlug(value: string): value is RatgeberSlug {
  return value in RATGEBER_SLUGS;
}

/**
 * Every German path that has a translated URL, paired with the segments it is
 * built from. This is the single declarative list the maps below derive from.
 */
function uebersetzbarePfade(): { deutsch: string; teile: PfadTeil[] }[] {
  const ratgeberIndex: PfadTeil[] = [{ art: "segment", wert: "ratgeber" }];

  return [
    { deutsch: "/ratgeber", teile: ratgeberIndex },
    ...(Object.keys(RATGEBER_SLUGS) as RatgeberSlug[]).map((slug) => ({
      deutsch: `/ratgeber/${slug}`,
      teile: [...ratgeberIndex, { art: "ratgeberSlug" as const, wert: slug }],
    })),
  ];
}

type PfadTeil =
  | { art: "segment"; wert: UebersetztesSegment }
  | { art: "ratgeberSlug"; wert: RatgeberSlug };

function uebersetzeTeil(teil: PfadTeil, locale: Locale): string {
  return teil.art === "segment"
    ? SEGMENTE[teil.wert][locale]
    : RATGEBER_SLUGS[teil.wert][locale];
}

/**
 * German path → path in that locale, and the reverse.
 *
 * Both directions are precomputed because both are on hot paths: every link
 * the site renders goes through the forward map, and every request goes
 * through the reverse one. The set is small and fixed at build time — 9 paths
 * today, ~85 once the defect pages follow — so a pair of maps per locale
 * costs nothing and removes all parsing ambiguity between a segment and a
 * slug that happen to share a name.
 */
const { hin, zurueck } = (() => {
  const hin = {} as Record<Locale, Map<string, string>>;
  const zurueck = {} as Record<Locale, Map<string, string>>;

  for (const { code } of locales) {
    hin[code] = new Map();
    zurueck[code] = new Map();
  }

  for (const { deutsch, teile } of uebersetzbarePfade()) {
    for (const { code } of locales) {
      const lokal = `/${teile.map((t) => uebersetzeTeil(t, code)).join("/")}`;

      const kollision = zurueck[code].get(lokal);
      if (kollision && kollision !== deutsch) {
        throw new Error(
          `Duplicate ${code} URL "${lokal}" for both "${kollision}" and "${deutsch}".`,
        );
      }

      hin[code].set(deutsch, lokal);
      zurueck[code].set(lokal, deutsch);
    }
  }

  return { hin, zurueck };
})();

/**
 * The localized form of a German path, or `null` if the path has no
 * translated URL. Legal texts and the homepage are not in here: they keep
 * their German path under every prefix and are handled by `localeHref`.
 */
export function lokalerPfad(locale: Locale, pfad: string): string | null {
  return hin[locale].get(pfad) ?? null;
}

/** The German path a localized path stands for, or `null` if unknown. */
export function deutscherPfad(locale: Locale, pfad: string): string | null {
  return zurueck[locale].get(pfad) ?? null;
}

/** Every German path that has a translated URL. Drives the sitemap. */
export function alleUebersetztenPfade(): string[] {
  return uebersetzbarePfade().map((p) => p.deutsch);
}
