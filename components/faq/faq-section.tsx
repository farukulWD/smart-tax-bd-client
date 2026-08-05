"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetFaqsQuery } from "@/redux/api/faq/faqApi";
import SectionEyebrow from "@/components/shared/section-eyebrow";

export function FaqSection() {
  const t = useTranslations("faq");
  const { data, isLoading } = useGetFaqsQuery();
  const faqs = data?.data ?? [];

  // Nothing published yet — keep the home page clean
  if (!isLoading && faqs.length === 0) return null;

  return (
    <section className="py-14 md:py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <SectionEyebrow>{t("badge")}</SectionEyebrow>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground md:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {t("description")}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((item) => (
              <AccordionItem key={item._id} value={item._id}>
                <AccordionTrigger className="text-base font-semibold text-foreground">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  );
}
