"use client";

import {
  Briefcase,
  Copy,
  Download,
  FileText,
  ListChecks,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetHowItWorkSectionQuery,
  useGetHowItWorksQuery,
} from "@/redux/api/how-it-work/howItWorkApi";

const iconMap: Record<string, LucideIcon> = {
  "file-text": FileText,
  briefcase: Briefcase,
  upload: Upload,
  copy: Copy,
  download: Download,
};

export function HowItWorksSection() {
  const { data: sectionData, isLoading: isSectionLoading } =
    useGetHowItWorkSectionQuery();
  const { data: stepsData, isLoading: isStepsLoading } =
    useGetHowItWorksQuery();

  const section = sectionData?.data;
  const steps = stepsData?.data ?? [];
  const isLoading = isSectionLoading || isStepsLoading;

  // Nothing configured yet — keep the home page clean
  if (!isLoading && (!section || steps.length === 0)) return null;

  return (
    <section className="py-14 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 text-center">
          {isLoading ? (
            <div className="mx-auto flex max-w-xl flex-col items-center gap-3">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-10 w-full max-w-lg" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            <>
              {section?.badge && (
                <p className="inline-flex rounded-full border border-green-200 bg-green-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-green-700">
                  {section.badge}
                </p>
              )}
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                {section?.titlePrefix}{" "}
                <span className="text-red-600">{section?.titleHighlight}</span>
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
                {section?.description}
              </p>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-stretch justify-center gap-x-6 gap-y-10">
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex w-full max-w-55 flex-1 basis-55 flex-col items-center"
                >
                  <Skeleton className="z-10 -mb-8 h-16 w-16 rounded-full" />
                  <Skeleton className="h-32 w-full rounded-2xl" />
                </div>
              ))
            : steps.map((step, index) => {
                const Icon = iconMap[step.icon] ?? ListChecks;
                return (
                  <div
                    key={step._id}
                    className="flex w-full max-w-55 flex-1 basis-55 flex-col items-center"
                  >
                    <div className="z-10 -mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white shadow-lg">
                      <Icon className="h-7 w-7" />
                    </div>
                    <Card className="flex h-full w-full flex-col rounded-2xl border-slate-200/60 pt-10 text-center shadow-sm">
                      <CardContent className="flex flex-1 flex-col justify-center">
                        <p className="text-lg font-bold text-slate-900">
                          Step {index + 1}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                          {step.title}
                        </p>
                        {step.description && (
                          <p className="mt-1 text-xs leading-relaxed text-slate-500">
                            {step.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
