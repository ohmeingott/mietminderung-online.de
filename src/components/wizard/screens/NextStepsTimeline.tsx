"use client";

import { AlertTriangle, CalendarClock, Gavel, Mailbox, Scale, Send } from "lucide-react";
import Link from "next/link";
import { useWizard } from "@/components/wizard/WizardContext";
import { fristDatum, formatiereDatum } from "@/lib/brief/frist";
import { useTranslation } from "@/i18n/LanguageContext";

/**
 * What happens after the letter goes out.
 *
 * The flow answered every question except the one people actually ask next:
 * how long do I wait? There is no statutory deadline for a reply - what counts
 * is the deadline the tenant set for the repair, and it starts running on
 * delivery, not on posting. Saying so with real dates is the whole point.
 */
export default function NextStepsTimeline() {
  const { fristTage } = useWizard();
  const { t } = useTranslation();

  const heute = new Date();
  const frist = fristDatum(heute, fristTage);
  const danach = fristDatum(frist, 1);

  const stationen = [
    { id: "s1", Icon: Send, datum: t("next.s1.when").replace("{datum}", formatiereDatum(heute)) },
    { id: "s2", Icon: Mailbox, datum: t("next.s2.when") },
    { id: "s3", Icon: Scale, datum: t("next.s3.when") },
    {
      id: "s4",
      Icon: CalendarClock,
      datum: t("next.s4.when").replace("{datum}", formatiereDatum(frist)),
    },
    {
      id: "s5",
      Icon: Gavel,
      datum: t("next.s5.when").replace("{datum}", formatiereDatum(danach)),
    },
  ];

  return (
    <div className="mt-8">
      <h3 className="text-base font-semibold text-ink-900">{t("next.title")}</h3>
      <p className="mt-1 text-sm text-ink-500">{t("next.subtitle")}</p>

      {/* border-s + ps-*, never border-l: the whole page mirrors in Arabic. */}
      <ol data-testid="letter-timeline" className="relative mt-5 border-s border-ink-200">
        {/*
         * The indent belongs on the li, not the ol: the badge is positioned
         * against the li's padding box, so ps-8 here is what puts start-0 on
         * the rail. Indent the ol instead and the badge starts a full 2rem
         * inside it - straight through the text.
         */}
        {stationen.map(({ id, Icon, datum }) => (
          <li key={id} className="relative ps-8 pb-6 last:pb-0">
            <span
              aria-hidden
              className="absolute start-0 top-0 inline-flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-brand-50 ring-4 ring-paper-raised rtl:translate-x-1/2"
            >
              <Icon className="h-4 w-4 text-brand-600" />
            </span>
            <p className="text-sm font-semibold tabular-nums text-ink-900">{datum}</p>
            <p className="mt-0.5 text-sm leading-relaxed text-ink-600">{t(`next.${id}.text`)}</p>
          </li>
        ))}
      </ol>

      <div className="mt-5 flex items-start gap-3 rounded-field border border-caution-600/20 bg-caution-50 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-caution-600" aria-hidden />
        <p className="text-sm text-caution-600">
          <strong>{t("common.note")}:</strong> {t("next.caution")}
        </p>
      </div>

      <Link
        href="/ratgeber/maengelanzeige-schreiben"
        className="mt-4 inline-flex min-h-[2.75rem] items-center text-sm font-medium text-brand-700 underline underline-offset-2 transition-colors hover:text-brand-900"
      >
        {t("next.guideLink")}
      </Link>
    </div>
  );
}
