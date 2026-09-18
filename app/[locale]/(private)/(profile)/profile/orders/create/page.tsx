"use client";

import { Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { globalErrorHandler } from "@/helpers/globalErrorHandler";
import {
  useCreateTaxStepOneMutation,
  useGetTaxTypesQuery,
} from "@/redux/api/order/orderApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import Link from "next/link";
import Image from "next/image";
import { isIconUrl } from "@/components/taxes/helper/ui-data";
import { useGetMeQuery } from "@/redux/api/auth/authApi";
import { useTranslations, useLocale } from "next-intl";
import { readLocalized } from "@/lib/localize";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  tax_types: z.array(z.string()).min(1, "Please select at least one tax type"),
  tax_year: z.string().min(1, "Tax year is required"),
});

type FormValues = z.infer<typeof formSchema>;

const CURRENT_YEAR = new Date().getFullYear();
const TAX_YEARS = Array.from({ length: 10 }, (_, i) => {
  const year = CURRENT_YEAR - i;
  return `${year}-${year + 1}`;
});

const CreateOrderForm = () => {
  const t = useTranslations("createOrder");
  const locale = useLocale();
  const router = useRouter();
  const params = useSearchParams();
  const taxType = params.get("taxType") || "";
  const [createTaxStepOne, { isLoading: isCreatingOrder }] =
    useCreateTaxStepOneMutation();

  const { data: taxTypesData, isLoading: isLoadingTaxTypes } =
    useGetTaxTypesQuery(undefined, {
      selectFromResult: (result) => ({
        data: result.data?.data,
        isLoading: result.isLoading,
      }),
    });
  const activeTaxTypes = (taxTypesData ?? []).filter((type) => type.isActive);

  const { data: profileData } = useGetMeQuery(undefined, {
    selectFromResult: ({ data }) => ({
      data: data?.data,
    }),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tax_types: [],
      tax_year: `${CURRENT_YEAR}-${CURRENT_YEAR + 1}`,
    },
  });

  useEffect(() => {
    const matched = activeTaxTypes.some((type) => type.value === taxType);
    if (matched && form.getValues("tax_types").length === 0) {
      form.setValue("tax_types", [taxType]);
    }
  }, [taxType, activeTaxTypes, form]);

  const onSubmit = async (values: FormValues) => {
    if (!profileData?.name || !profileData?.mobile) {
      toast.error("Complete your profile before creating an order");
      return;
    }

    try {
      const orderResponse = await createTaxStepOne({
        personal_information: {
          name: profileData.name,
          ...(profileData.email ? { email: profileData.email } : {}),
          phone: profileData.mobile,
          are_you_student: false,
          are_you_house_wife: false,
        },
        tax_year: values.tax_year,
        tax_types: values.tax_types,
      }).unwrap();

      const orderId = orderResponse?.data?.tax_order?._id;
      if (!orderId) {
        toast.error("Order created but no order ID was returned");
        router.push("/profile/orders");
        return;
      }

      toast.success("Step 1 completed. Upload required documents next.");
      router.push(`/profile/orders/create/${orderId}`);
    } catch (error: any) {
      globalErrorHandler(error);
    }
  };

  const selectedTaxTypes = useWatch({
    control: form.control,
    name: "tax_types",
  });
  const selectedTaxYear = useWatch({
    control: form.control,
    name: "tax_year",
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-6">
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-green-100/20 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-green-100/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto space-y-8">
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
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-bold mb-2 border border-green-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t("badge")}</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                {t("title")}
              </h1>
              <p className="text-slate-500 font-medium">{t("subtitle")}</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-800">
                {t("taxFilingYear")}
              </h2>

              <FormField
                control={form.control}
                name="tax_year"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            className="w-full"
                            placeholder={t("selectYear")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TAX_YEARS.map((year) => (
                          <SelectItem key={year} value={year}>
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

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-800">
                {t("taxTypeSection")}
              </h2>
              <FormField
                control={form.control}
                name="tax_types"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {isLoadingTaxTypes &&
                        Array.from({ length: 6 }).map((_, index) => (
                          <Skeleton
                            key={`tax-type-skeleton-${index}`}
                            className="h-12 rounded-xl"
                          />
                        ))}
                      {!isLoadingTaxTypes &&
                        activeTaxTypes.map((type) => {
                          const checked = field.value.includes(type.value);
                          return (
                            <label
                              key={type.value}
                              className="flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer"
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(nextChecked) => {
                                  if (nextChecked) {
                                    field.onChange([
                                      ...field.value,
                                      type.value,
                                    ]);
                                    return;
                                  }
                                  field.onChange(
                                    field.value.filter(
                                      (value) => value !== type.value,
                                    ),
                                  );
                                }}
                              />
                              {isIconUrl(type.icon) && (
                                <span className="relative h-6 w-6 shrink-0">
                                  <Image
                                    src={type.icon!}
                                    alt=""
                                    fill
                                    sizes="24px"
                                    className="object-contain"
                                  />
                                </span>
                              )}
                              <span className="text-sm text-slate-700">
                                {readLocalized(type.title, locale)}
                              </span>
                            </label>
                          );
                        })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Card className="sticky bottom-0 z-20 gap-3 py-5 bg-slate-900 text-white rounded-3xl border-none shadow-2xl overflow-hidden">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg">{t("orderSummary")}</CardTitle>
                <CardDescription className="text-slate-400">
                  {t("orderSummaryDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t("taxTypesLabel")}</span>
                    <span className="font-bold">
                      {selectedTaxTypes.length} {t("selected")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t("taxYear")}</span>
                    <span className="font-bold">{selectedTaxYear}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isCreatingOrder}
                  className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl"
                >
                  {isCreatingOrder ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {t("next")}
                      <CheckCircle2 className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
};

const CreateOrderPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        </div>
      }
    >
      <CreateOrderForm />
    </Suspense>
  );
};

export default CreateOrderPage;
