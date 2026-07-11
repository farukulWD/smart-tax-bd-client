"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/ui/star-rating";
import {
  useGetMyReviewQuery,
  useUpsertMyReviewMutation,
} from "@/redux/api/review/reviewApi";
import { globalErrorHandler } from "@/helpers/globalErrorHandler";

const reviewSchema = z.object({
  rating: z.number().min(1, { message: "Please select a rating" }).max(5),
  comment: z.string().min(1, { message: "Please write a review" }),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

const statusVariant = {
  pending: "outline",
  approved: "default",
  rejected: "destructive",
} as const;

export default function ReviewsPage() {
  const t = useTranslations("reviewsPage");
  const { data, isLoading } = useGetMyReviewQuery();
  const [upsertMyReview, { isLoading: isSubmitting }] = useUpsertMyReviewMutation();

  const review = data?.data;

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  });
  const rating = useWatch({ control: form.control, name: "rating" });

  useEffect(() => {
    if (review) {
      form.reset({ rating: review.rating, comment: review.comment });
    }
  }, [review, form]);

  const onSubmit = async (values: ReviewFormValues) => {
    try {
      await upsertMyReview(values).unwrap();
      toast.success(t("submitSuccess"));
    } catch (error) {
      globalErrorHandler(error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {review && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{t("statusLabel")}:</span>
            <Badge variant={statusVariant[review.status]}>
              {t(`status${review.status.charAt(0).toUpperCase()}${review.status.slice(1)}` as
                | "statusPending"
                | "statusApproved"
                | "statusRejected")}
            </Badge>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("ratingLabel")}</label>
            <StarRating
              value={rating}
              onChange={(value) => form.setValue("rating", value, { shouldValidate: true })}
              size="lg"
            />
            {form.formState.errors.rating && (
              <p className="text-sm text-destructive">{t("ratingRequired")}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("commentLabel")}</label>
            <Textarea
              placeholder={t("commentPlaceholder")}
              rows={5}
              {...form.register("comment")}
            />
            {form.formState.errors.comment && (
              <p className="text-sm text-destructive">
                {form.formState.errors.comment.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("submitting") : review ? t("resubmit") : t("submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
