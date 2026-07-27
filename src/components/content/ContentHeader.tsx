import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/mietminderung", label: "Mängel A–Z" },
  { href: "/mietminderungstabelle", label: "Mietminderungstabelle" },
  { href: "/ratgeber", label: "Ratgeber" },
  { href: "/faq", label: "FAQ" },
];

/**
 * Static, server-rendered header for the content pages. Deliberately plain
 * <Link> markup so every crawler sees the internal link graph without JS.
 */
export default function ContentHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.png"
              alt="Mietminderung Online"
              width={36}
              height={36}
              className="w-9 h-9"
            />
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900">
              Mietminderung<span className="text-blue-600">-online</span>
            </span>
          </Link>

          <nav aria-label="Hauptnavigation" className="hidden md:block">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            href="/#pruefung"
            className="shrink-0 px-4 sm:px-5 py-2.5 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
          >
            Kostenlos prüfen
          </Link>
        </div>

        <nav aria-label="Mobile Navigation" className="md:hidden pb-3">
          <ul className="flex items-center gap-4 overflow-x-auto text-sm">
            {navLinks.map((link) => (
              <li key={link.href} className="shrink-0">
                <Link
                  href={link.href}
                  className="font-medium text-gray-600 hover:text-blue-700"
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
