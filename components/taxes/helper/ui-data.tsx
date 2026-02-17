export interface TaxType {
  _id: string;
  title: string;
  rate: number;
  value: string;
  icon?: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
