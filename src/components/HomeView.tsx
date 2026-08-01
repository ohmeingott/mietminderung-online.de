import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import HomeCheckFlow from "@/components/HomeCheckFlow";
import InfoSection from "@/components/InfoSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import VersandTeaser from "@/components/VersandTeaser";
import PopularLinks from "@/components/content/PopularLinks";
import { DEFAULT_LOCALE } from "@/i18n/routing";
import type { Locale } from "@/i18n/translations";

/**
 * The landing page, shared by the German root route and every `/xx` locale
 * route. The translated sections read their language from the URL through
 * `LanguageProvider`, so this component needs no locale of its own.
 *
 * `PopularLinks` is the exception and is German-only on purpose: it links the
 * defect pages, category hubs and guides, all of which exist only in German.
 * Showing that block on /tr would send a Turkish reader — and a crawler
 * following the Turkish page — into 60-odd German pages, which is both a bad
 * experience and a confusing signal about what language the page is in.
 */
export default function HomeView({ locale }: { locale: Locale }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <HomeCheckFlow />
        <HowItWorks />
        <VersandTeaser />
        <InfoSection />
        {locale === DEFAULT_LOCALE && <PopularLinks />}
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
