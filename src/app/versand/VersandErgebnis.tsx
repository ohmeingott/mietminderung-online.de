"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Info } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/i18n/LanguageContext";

/**
 * Where Stripe Checkout sends the payer back to.
 *
 * These are their own pages rather than a state inside the letter wizard for
 * one blunt reason: the wizard's answers, the address and the signature live
 * in React state, and the full-page trip to Stripe and back destroys it.
 * Restoring it would mean writing the tenant's name, address, e-mail and
 * signature image into browser storage — a privacy decision nobody has made —
 * and a returning payer does not need the letter back anyway. They need to
 * know what happened to their money.
 *
 * So both variants say only what is actually known at this moment, and both
 * say plainly that the draft is gone rather than dropping the user onto a form
 * that mysteriously looks empty.
 */
export type ErgebnisVariante = "erfolg" | "abbruch";

/**
 * Spelled out rather than built from the variant, so that every key this page
 * needs can still be found by grepping for it — the i18n check compares the
 * locales against German and would not notice a key nothing looks up.
 */
const TEXTE = {
  erfolg: {
    title: "dispatch.result.erfolg.title",
    text: "dispatch.result.erfolg.text",
    note: "dispatch.result.erfolg.note",
  },
  abbruch: {
    title: "dispatch.result.abbruch.title",
    text: "dispatch.result.abbruch.text",
    note: "dispatch.result.abbruch.note",
  },
} as const;

export default function VersandErgebnis({
  variante,
}: {
  variante: ErgebnisVariante;
}) {
  const { t } = useTranslation();

  const erfolg = variante === "erfolg";
  const schluessel = TEXTE[variante];
  const Icon = erfolg ? CheckCircle2 : Info;
  const akzent = erfolg ? "text-signal-700" : "text-caution-600";

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div
            data-testid={`versand-ergebnis-${variante}`}
            role="status"
            className={`rounded-[var(--radius-card)] border p-6 sm:p-8 ${
              erfolg
                ? "border-signal-600/20 bg-signal-50"
                : "border-caution-600/20 bg-caution-50"
            }`}
          >
            <Icon
              className={`h-9 w-9 ${erfolg ? "text-signal-600" : "text-caution-600"}`}
              aria-hidden
            />

            <h1
              className={`mt-4 text-[1.75rem] font-bold leading-tight tracking-tight sm:text-4xl ${akzent}`}
            >
              {t(schluessel.title)}
            </h1>

            <p className={`mt-4 text-base leading-relaxed sm:text-lg ${akzent}`}>
              {t(schluessel.text)}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-ink-700">
              {t(schluessel.note)}
            </p>
          </div>

          {/*
            The cancel page leads with "start over". Since the draft survives
            in sessionStorage, that link now lands back on the finished letter
            rather than on an empty form, so a cancelled payment can simply be
            retried. The success page must not offer it: a paying customer
            invited to "create a new Mängelanzeige" would reasonably wonder
            whether the first one went through.
          */}
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            {!erfolg && (
              <Button href="/#maengelanzeige">
                {t("dispatch.result.restartCta")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
              </Button>
            )}
            <Link
              href="/"
              className={
                erfolg
                  ? "inline-flex min-h-[3rem] items-center justify-center rounded-full bg-brand-700 px-6 font-semibold text-white transition-colors hover:bg-brand-800"
                  : "inline-flex min-h-[3rem] items-center justify-center rounded-full border border-ink-200 bg-paper-raised px-6 font-semibold text-ink-800 transition-colors hover:border-brand-300 hover:text-brand-700"
              }
            >
              {t("common.backHome")}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
