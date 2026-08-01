import {
  BRAND_MARK_LETTERS_TRANSFORM,
  BRAND_MARK_M_PATH,
  BRAND_MARK_O_OFFSET,
  BRAND_MARK_O_PATH,
  BRAND_MARK_RADIUS,
  BRAND_MARK_SIZE,
  BRAND_MARK_VIEWBOX,
} from "@/lib/brandMark";

type Props = {
  /** Sizing utilities for the <svg> itself, e.g. "h-9 w-9". */
  className?: string;
  /** Fill utility for the rounded tile. */
  tileClassName?: string;
  /** Fill utility for the MO letterforms. */
  letterClassName?: string;
};

/**
 * The "MO" monogram, inline so the two fills can be set per surface.
 *
 * Site icons come from lucide-react; this component is only the brand mark, and
 * it shares its geometry with the favicon and every generated PNG via
 * src/lib/brandMark.ts.
 *
 * Inline rather than an <Image> pointing at a file in public/ for two reasons.
 * The mark has to invert on the dark footer, and the previous approach - a
 * `brightness-0 invert` filter over a PNG - cannot survive a solid tile: those
 * filters touch RGB only, so a filled shape flattens to a plain white square.
 * That was a real bug once already (commit 24a7955). Setting the fills directly
 * sidesteps the whole class of problem, and drops a request from the header's
 * critical path as a bonus.
 *
 * Decorative by default: every place it is used sits next to the brand name in
 * live text, so announcing it again would only be noise.
 */
export default function BrandMark({
  className,
  tileClassName = "fill-brand-700",
  letterClassName = "fill-white",
}: Props) {
  return (
    <svg
      viewBox={BRAND_MARK_VIEWBOX}
      width={BRAND_MARK_SIZE}
      height={BRAND_MARK_SIZE}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect
        width={BRAND_MARK_SIZE}
        height={BRAND_MARK_SIZE}
        rx={BRAND_MARK_RADIUS}
        className={tileClassName}
      />
      <g transform={BRAND_MARK_LETTERS_TRANSFORM} className={letterClassName}>
        <path d={BRAND_MARK_M_PATH} />
        <path d={BRAND_MARK_O_PATH} transform={`translate(${BRAND_MARK_O_OFFSET} 0)`} />
      </g>
    </svg>
  );
}
