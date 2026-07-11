import HeroBanner from "@/components/hero-section/hero-banner";
import TaxesTypes from "@/components/taxes/taxes-types";
import { HowItWorksSection } from "@/components/how-it-works/how-it-works-section";
import { HomeBlogSection } from "@/components/blog/home-blog-section";
import { TestimonialsSection } from "@/components/reviews/testimonials-section";
import { FaqSection } from "@/components/faq/faq-section";

export default function Home() {
  return (
    <main className="space-y-4">
      <HeroBanner />
      <TaxesTypes />
      <HowItWorksSection />
      <HomeBlogSection />
      <TestimonialsSection />
      <FaqSection />
    </main>
  );
}
