"use client";

import {
  AlertTriangle,
  BookOpen,
  CalendarClock,
  Clock,
  Gavel,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

const cards = [
  { icon: Scale, titleKey: "info.c1.title", descKey: "info.c1.desc" },
  { icon: ShieldCheck, titleKey: "info.c2.title", descKey: "info.c2.desc" },
  { icon: BookOpen, titleKey: "info.c3.title", descKey: "info.c3.desc" },
  { icon: Gavel, titleKey: "info.c4.title", descKey: "info.c4.desc" },
  { icon: AlertTriangle, titleKey: "info.c5.title", descKey: "info.c5.desc" },
  { icon: Clock, titleKey: "info.c6.title", descKey: "info.c6.desc" },
  // "How long do I wait for an answer?" - the question the flow itself now
  // answers on its last screen, said here too for readers who never start it.
  { icon: CalendarClock, titleKey: "info.c7.title", descKey: "info.c7.desc" },
] as const;

export default function InfoSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            {t("info.title")}
          </h2>
          <p className="mt-3 text-base text-ink-600 sm:mt-4 sm:text-lg">
            {t("info.subtitle")}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {cards.map((card) => (
            <article
              key={card.titleKey}
              className="card-hover rounded-[var(--radius-card)] border border-ink-200 bg-paper-raised p-5 sm:p-6"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <card.icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-base font-bold text-ink-900 sm:text-lg">
                {t(card.titleKey)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {t(card.descKey)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
