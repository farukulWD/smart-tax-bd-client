import { LocalizedText } from "@/lib/localize";

export interface TaxType {
  _id: string;
  title: LocalizedText | string;
  rate: number;
  value: string;
  icon?: string;
  description: LocalizedText | string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// `icon` used to hold a lucide icon name; it now holds an uploaded image URL.
// Legacy values fall back to the title initials.
export const isIconUrl = (icon?: string) => !!icon && /^https?:\/\//.test(icon);

const STOPWORDS = new Set([
  "from",
  "the",
  "of",
  "and",
  "for",
  "to",
  "a",
  "an",
  "tax",
  "return",
]);

/**
 * Fallback avatar text for tax types whose `icon` is not an uploaded image URL.
 * Mirrors the mobile app's `TaxCard` so both surfaces show the same initials.
 */
export const getInitials = (raw: string): string => {
  const words = raw
    .replace(/[^A-Za-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word && !STOPWORDS.has(word.toLowerCase()));

  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return raw.trim().slice(0, 2).toUpperCase();
};
