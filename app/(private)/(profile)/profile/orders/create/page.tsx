"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { globalErrorHandler } from "@/helpers/globalErrorHandler";
import {
  useCreateOrderMutation,
  useGetTaxTypesQuery,
} from "@/redux/api/order/orderApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Briefcase,
  Calendar,
  Phone,
  Hash,
  CircleDollarSign,
  ShoppingCart,
  ReceiptText,
  Globe2,
  ShieldCheck,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import Link from "next/link";
import { useGetMeQuery } from "@/redux/api/auth/authApi";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^(\+8801|01)[3-9]\d{8}$/, "Invalid mobile number format"),
  tax_or_vat_number: z.string().min(1, "Tax/VAT number is required"),
  tax_types: z
    .array(z.string())
    .min(1, "Please select at least one tax service"),
  tax_year: z.string().min(1, "Tax year is required"),
});

type FormValues = z.infer<typeof formSchema>;

const CURRENT_YEAR = new Date().getFullYear();
const TAX_YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);

const iconMap: Record<string, any> = {
  income_tax: CircleDollarSign,
  sales_tax: ShoppingCart,
  value_added_tax: ReceiptText,
  service_tax: Briefcase,
  import_duty: Globe2,
};

const CreateOrderPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const taxType = params.get("taxType");
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const { data: taxTypes, isLoading: taxTypesLoading } = useGetTaxTypesQuery(
    undefined,
    {
      selectFromResult: ({ data, isLoading }) => ({
        data: data?.data,
        isLoading: isLoading,
      }),
    },
  );

  const { data: profileData } = useGetMeQuery(undefined, {
    selectFromResult: ({ data }) => ({
      data: data?.data,
    }),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobile: "",
      tax_or_vat_number: "",
      tax_types: [],
      tax_year: CURRENT_YEAR.toString(),
    },
  });

  // Sync profile data when available
  useEffect(() => {
    if (profileData) {
      if (profileData.mobile && !form.getValues("mobile")) {
        form.setValue("mobile", profileData.mobile);
      }
      if (
        profileData.tax_or_vat_number &&
        !form.getValues("tax_or_vat_number")
      ) {
        form.setValue("tax_or_vat_number", profileData.tax_or_vat_number);
      }
    }
  }, [profileData, form]);

  // Sync tax types based on query parameter
  useEffect(() => {
    if (taxTypes && taxType) {
      const selectedType = taxTypes.find(
        (t: any) => t.value === taxType || t._id === taxType,
      );
      if (selectedType) {
        form.setValue("tax_types", [selectedType._id]);
      }
    }
  }, [taxTypes, taxType, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await createOrder({
        ...values,
        is_taxable_income: false,
      } as any).unwrap();
      toast.success("Order created successfully");
      router.push("/profile/orders");
    } catch (error: any) {
      globalErrorHandler(error);
    }
  };

  const selectedTaxTypes = form.watch("tax_types");

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Decorative background components */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-green-100/20 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-emerald-100/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
          <div className="flex items-center gap-5">
            <Link href="/profile/orders">
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-xl bg-white shadow-sm hover:shadow transition-all border-slate-200"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </Button>
            </Link>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2 border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SECURE CHECKOUT</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Create New Order
              </h1>
              <p className="text-slate-500 font-medium">
                Complete the details below to initiate your tax filing
              </p>
            </div>
          </div>
        </div>

        {taxTypesLoading ? (
          <div className="flex flex-col items-center justify-center p-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Loader2 className="h-10 w-10 animate-spin text-green-600 mb-4" />
            <p className="text-slate-500 font-medium animate-pulse">
              Preparing your order form...
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Step 1: Service Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white text-sm font-bold shadow-lg shadow-green-200">
                    1
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Select Tax Services
                  </h2>
                </div>

                <FormField
                  control={form.control}
                  name="tax_types"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {taxTypes?.map((item: any) => {
                          const Icon = iconMap[item.value] || CircleDollarSign;
                          const isSelected = field.value?.includes(item._id);

                          return (
                            <div
                              key={item._id}
                              onClick={() => {
                                const current = field.value || [];
                                const next = isSelected
                                  ? current.filter(
                                      (v: string) => v !== item._id,
                                    )
                                  : [...current, item._id];
                                field.onChange(next);
                              }}
                              className={cn(
                                "relative group cursor-pointer h-full transition-all duration-300 rounded-2xl p-4 border-2 flex flex-col gap-3",
                                isSelected
                                  ? "bg-emerald-50/50 border-emerald-500 shadow-md shadow-emerald-100"
                                  : "bg-white border-slate-100 hover:border-emerald-200 hover:shadow-sm shadow-sm",
                              )}
                            >
                              <div className="flex items-start justify-between">
                                <div
                                  className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300",
                                    isSelected
                                      ? "bg-emerald-600 text-white"
                                      : "bg-slate-50 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600",
                                  )}
                                >
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                  <h3
                                    className={cn(
                                      "font-bold text-base transition-colors",
                                      isSelected
                                        ? "text-emerald-900"
                                        : "text-slate-800",
                                    )}
                                  >
                                    {item.title}
                                  </h3>
                                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                                    {item.description}
                                  </p>
                                </div>

                                <div
                                  className={cn(
                                    " rounded-full p-0.5",
                                    isSelected
                                      ? "bg-emerald-500"
                                      : "bg-slate-50",
                                  )}
                                >
                                  <CheckCircle2
                                    className={cn(
                                      "w-4 h-4",
                                      isSelected
                                        ? "text-white"
                                        : "text-slate-500",
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <FormMessage className="text-sm font-medium" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Step 2: Information Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 h-full">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white text-sm font-bold shadow-lg shadow-green-200">
                        2
                      </div>
                      <h2 className="text-xl font-bold text-slate-800">
                        Personal Details
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-slate-600 font-semibold mb-2">
                              <Phone className="w-4 h-4 opacity-70" />
                              Mobile Number
                            </FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Input
                                  placeholder="e.g. 01712345678"
                                  className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-green-500/20 focus:border-green-500 rounded-xl transition-all"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tax_or_vat_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-slate-600 font-semibold mb-2">
                              <Hash className="w-4 h-4 opacity-70" />
                              Tax / VAT Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your ID number"
                                className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-green-500/20 focus:border-green-500 rounded-xl transition-all"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tax_year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-slate-600 font-semibold mb-2">
                              <Calendar className="w-4 h-4 opacity-70" />
                              Tax Filing Year
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-green-500/20 focus:border-green-500 rounded-xl transition-all">
                                  <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl border-slate-200">
                                {TAX_YEARS.map((year) => (
                                  <SelectItem
                                    key={year}
                                    value={year.toString()}
                                    className="hover:bg-emerald-50 transition-colors"
                                  >
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Submision Sidebar */}
                <div className="lg:col-span-1">
                  <Card className="bg-slate-900 text-white rounded-3xl border-none shadow-xl overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-2xl rounded-full" />
                    <CardHeader className="relative pb-0">
                      <CardTitle className="text-xl">Order Summary</CardTitle>
                      <CardDescription className="text-slate-400">
                        Review your final selection
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative pt-6 space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400 font-medium">
                            Services
                          </span>
                          <span className="text-white font-bold">
                            {selectedTaxTypes.length} Selected
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400 font-medium">
                            Tax Year
                          </span>
                          <span className="text-white font-bold">
                            {form.watch("tax_year")}
                          </span>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-800">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-14 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl shadow-lg shadow-green-900/40 transition-all active:scale-[0.98] group"
                        >
                          {isLoading ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              Confirm & Create Order
                              <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </span>
                          )}
                        </Button>
                        <p className="text-[10px] text-center text-slate-500 mt-4 leading-relaxed">
                          By confirming, you agree to our terms of service and
                          professional compliance guidelines.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default CreateOrderPage;
