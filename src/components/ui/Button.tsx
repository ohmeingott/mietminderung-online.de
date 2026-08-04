import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "onDark" | "onDarkGhost";
type Size = "md" | "sm";

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const SIZE_CLASSES: Record<Size, string> = {
  md: "min-h-[3rem] px-6",
  sm: "min-h-[2.75rem] px-5 text-sm",
};

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-brand-700 text-white hover:bg-brand-800",
  secondary:
    "border border-ink-200 bg-paper-raised text-ink-800 hover:border-brand-300 hover:text-brand-700",
  onDark: "bg-paper-raised text-brand-800 hover:bg-brand-50",
  onDarkGhost: "border border-white/25 text-white hover:bg-white/10",
};

type Styling = {
  variant?: Variant;
  size?: Size;
  /** Nur Layout: Breite, Außenabstand, Ausrichtung. Keine Farben, keine Radien. */
  className?: string;
  children: ReactNode;
};

type AsLink = Styling & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "href" | "className" | "children"
  >;

type AsButton = Styling & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<"button">,
    "className" | "children"
  >;

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", size = "md", className, children, ...rest } = props;
  const cls = [BASE_CLASSES, SIZE_CLASSES[size], VARIANT_CLASSES[variant], className]
    .filter(Boolean)
    .join(" ");

  if (typeof rest.href === "string") {
    return (
      <Link {...rest} href={rest.href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button {...(rest as ComponentPropsWithoutRef<"button">)} className={cls}>
      {children}
    </button>
  );
}
