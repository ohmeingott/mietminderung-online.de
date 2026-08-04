import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import { Button } from "@/components/ui/Button";
import { VERSAND_PATH } from "@/lib/seo";

const navLinks = [
  { href: "/mietminderung", label: "Mängel A–Z" },
  { href: "/mietminderungstabelle", label: "Mietminderungstabelle" },
  { href: VERSAND_PATH, label: "Brief versenden" },
  { href: "/ratgeber", label: "Ratgeber" },
  { href: "/faq", label: "FAQ" },
];

/**
 * Static, server-rendered header for the content pages. Deliberately plain
 * <Link> markup so every crawler sees the internal link graph without JS.
 */
export default function ContentHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-ink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <BrandMark className="w-9 h-9" />
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-ink-900">
              Mietminderung<span className="text-brand-600">-online</span>
            </span>
          </Link>

          <nav aria-label="Hauptnavigation" className="hidden md:block">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-ink-600 hover:text-brand-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Button href="/#pruefung" size="sm" className="shrink-0 max-sm:px-4">
            Kostenlos prüfen
          </Button>
        </div>

        <nav aria-label="Mobile Navigation" className="md:hidden pb-3">
          <ul className="flex items-center gap-4 overflow-x-auto text-sm">
            {navLinks.map((link) => (
              <li key={link.href} className="shrink-0">
                <Link
                  href={link.href}
                  className="font-medium text-ink-600 hover:text-brand-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
