"use client";

import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import {
  CircleDollarSign,
  ShoppingCart,
  ReceiptText,
  Briefcase,
  Globe2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useGetTaxTypesQuery } from "@/redux/api/order/orderApi";

const iconMap: Record<string, any> = {
  income_tax: CircleDollarSign,
  sales_tax: ShoppingCart,
  value_added_tax: ReceiptText,
  service_tax: Briefcase,
  import_duty: Globe2,
};

const TaxesTypes: FC = () => {
  const { data: taxTypes } = useGetTaxTypesQuery(undefined, {
    selectFromResult: (result) => ({
      data: result.data?.data,
    }),
  });

  return (
    <section className="py-24 px-4 bg-slate-50/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-100/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-100/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>Expert Compliance</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
              Tax Services <span className="text-green-600">&</span> Categories
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Navigate the complexities of Bangladeshi tax law with our
              specialized services. We provide accurate, timely, and compliant
              solutions for every tax category.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {taxTypes?.map((taxType) => {
            const Icon = iconMap[taxType.value] || CircleDollarSign;

            return (
              <Link
                href={`/profile/orders/create?taxType=${taxType.value}`}
                key={taxType.value}
                className="group block h-full"
              >
                <Card className="h-full border-slate-200/60 bg-white hover:bg-white transition-all duration-500 group-hover:border-green-500/20 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] group-hover:-translate-y-2 overflow-hidden relative rounded-2xl p-2">
                  <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700 pointer-events-none">
                    <Icon className="w-40 h-40 text-slate-900" />
                  </div>

                  <CardHeader className="pb-4">
                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-green-50 to-emerald-50 border border-green-100/50 flex items-center justify-center mb-4 group-hover:from-green-600 group-hover:to-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:shadow-green-600/20">
                      <Icon className="w-7 h-7" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800 group-hover:text-green-700 transition-colors duration-300">
                      {taxType.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-1">
                    <CardDescription className="text-slate-600 grow text-[15px] leading-relaxed line-clamp-3 mb-8">
                      {taxType.description}
                    </CardDescription>

                    <div className="flex  items-center text-sm font-bold text-green-600 pt-4 border-t border-slate-100 group-hover:border-green-100 transition-colors">
                      <span className="uppercase tracking-wider">
                        Explore Details
                      </span>
                      <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TaxesTypes;
