import HeroBanner from "@/components/hero-section/hero-banner";
import TaxesTypes from "@/components/taxes/taxes-types";
import { HomeBlogSection } from "@/components/blog/home-blog-section";

export default function Home() {
  return (
    <main className="space-y-4">
      <HeroBanner />
      <TaxesTypes />
      <HomeBlogSection />
    </main>
  );
}
