"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";
import type { IReview } from "@/redux/api/review/reviewApi";

const COMMENT_PREVIEW_LENGTH = 140;

export function TestimonialCard({ review }: { review: IReview }) {
  const t = useTranslations("testimonials");
  const [expanded, setExpanded] = useState(false);

  const isLong = review.comment.length > COMMENT_PREVIEW_LENGTH;
  const displayText =
    expanded || !isLong
      ? review.comment
      : `${review.comment.slice(0, COMMENT_PREVIEW_LENGTH).trim()}...`;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar className="h-11 w-11">
          <AvatarImage src={review.reviewerPhoto} alt={review.reviewerName} />
          <AvatarFallback className="bg-green-100 text-green-700">
            {review.reviewerName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-slate-900">{review.reviewerName}</p>
          {review.createdAt && (
            <p className="text-xs text-slate-400">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </p>
          )}
        </div>
      </div>

      <StarRating value={review.rating} readOnly size="sm" className="mt-3" />

      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
        {displayText}{" "}
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="font-semibold text-green-700 hover:underline"
          >
            {expanded ? t("seeLess") : t("seeMore")}
          </button>
        )}
      </p>
    </div>
  );
}
