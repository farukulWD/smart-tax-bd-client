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
// Legacy values fall back to the hardcoded lucide icons.
export const isIconUrl = (icon?: string) => !!icon && /^https?:\/\//.test(icon);
