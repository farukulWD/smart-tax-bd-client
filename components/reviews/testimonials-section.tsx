"use client";

import { useTranslations } from "next-intl";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPublicReviewsQuery } from "@/redux/api/review/reviewApi";
import { TestimonialCard } from "./testimonial-card";

export function TestimonialsSection() {
  const t = useTranslations("testimonials");
  const { data, isLoading } = useGetPublicReviewsQuery({ limit: 12 });
  const reviews = data?.data ?? [];

  // Nothing approved yet — keep the home page clean
  if (!isLoading && reviews.length === 0) return null;

  return (
    <section className="py-14 md:py-20 px-4 bg-green-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <p className="inline-flex rounded-full border border-green-200 bg-green-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-green-700">
            {t("badge")}
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
            {t("description")}
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-11 w-11 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <Carousel opts={{ align: "start", loop: reviews.length > 3 }} className="px-10">
            <CarouselContent>
              {reviews.map((review) => (
                <CarouselItem
                  key={review._id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <TestimonialCard review={review} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </div>
    </section>
  );
}
