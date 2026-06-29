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
