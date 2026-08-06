/**
 * Slugify a heading into an anchor id.
 *
 * German umlauts are transliterated the way German URLs conventionally do it,
 * so the anchors of the German guides keep the exact ids they have always had.
 * They are link targets, and a changed id silently breaks every deep link
 * pointing at one.
 *
 * Everything that is not a letter or a digit becomes a separator. Letters are
 * matched by Unicode property rather than by `a-z`, because these ids also have
 * to work for the Cyrillic and Arabic headings of the translated guides.
 * Restricted to ASCII, every Russian heading slugified to the empty string —
 * a table of contents pointing at nothing, and six sections sharing one
 * duplicate id.
 *
 * Non-Latin ids keep their own script instead of being transliterated, for the
 * same reason the URL slugs do: readers recognise their own writing system, and
 * `id="почему-уведомление"` is both valid HTML and a valid fragment.
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    // Every combining mark, not just the Latin block. NFD decomposes the
    // Arabic "\u0625" into a plain alif plus a combining hamza below, which sits
    // outside that block \u2014 left in place it is not a letter, so it became a
    // separator and split the word in half.
    .replace(/\p{M}+/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}
