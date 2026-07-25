"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import { useTranslation } from "@/i18n/LanguageContext";

/**
 * Shared chrome for the legal pages. The legal texts themselves stay German:
 * they describe a contract governed by German law and a translation would not
 * be the legally binding version.
 */
export default function LegalPage({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro?: string;
  updated?: string;
  children: ReactNode;
}) {
  const { t, locale } = useTranslation();

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex min-h-[2.75rem] items-center gap-2 text-sm font-medium text-brand-700 transition-colors hover:text-brand-900"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
            {t("common.backHome")}
          </Link>

          <h1 className="mt-4 text-[1.75rem] font-bold leading-tight tracking-tight text-ink-900 sm:text-4xl">
            {title}
          </h1>
          {intro && <p className="mt-3 text-base text-ink-600">{intro}</p>}

          {locale !== "de" && (
            <p
              lang="de"
              className="mt-5 rounded-[var(--radius-field)] border border-brand-200 bg-brand-50 p-4 text-sm text-brand-800"
            >
              Diese rechtlichen Informationen sind ausschließlich auf Deutsch
              verfügbar, da nur die deutsche Fassung rechtsverbindlich ist.
            </p>
          )}

          <article
            lang="de"
            dir="ltr"
            className="legal-prose mt-8 rounded-[var(--radius-card)] border border-ink-200 bg-paper-raised p-6 text-start sm:p-10"
          >
            {children}
            {updated && (
              <p className="mt-10 border-t border-ink-200 pt-5 text-sm text-ink-500">
                Stand: {updated}
              </p>
            )}
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/** A section inside a legal document. */
export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="text-lg font-bold text-ink-900">{heading}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-ink-700">{children}</div>
    </section>
  );
}

/**
 * Renders sections with running numbers. Sections can be omitted conditionally
 * (e.g. the paid-dispatch clauses) without leaving a gap in the numbering.
 */
export function NumberedSections({
  sections,
}: {
  sections: { heading: string; body: ReactNode }[];
}) {
  return (
    <>
      {sections.map((section, i) => (
        <LegalSection key={section.heading} heading={`${i + 1}. ${section.heading}`}>
          {section.body}
        </LegalSection>
      ))}
    </>
  );
}
