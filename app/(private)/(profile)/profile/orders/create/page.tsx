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
  IncomeSource,
  useCreateTaxStepOneMutation,
} from "@/redux/api/order/orderApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import Link from "next/link";
import { useGetMeQuery } from "@/redux/api/auth/authApi";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Email is required"),
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^(\+8801|01)[3-9]\d{8}$/, "Invalid mobile number format"),
  source_of_income: z
    .array(z.nativeEnum(IncomeSource))
    .min(1, "Please select at least one source of income"),
  tax_year: z.string().min(1, "Tax year is required"),
  income_from_ldt_company: z.boolean(),
  income_from_partnership_firm: z.boolean(),
  are_you_get_notice_from_tax_office: z.boolean(),
  for_other_person: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const CURRENT_YEAR = new Date().getFullYear();
const TAX_YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);

const INCOME_SOURCES: { value: IncomeSource; label: string }[] = [
  { value: IncomeSource.GovtJob, label: "Income from Govt. Job" },
  { value: IncomeSource.PrivateJob, label: "Income from Private Job" },
  { value: IncomeSource.Business, label: "Income from Business" },
  { value: IncomeSource.Rent, label: "Income from Rent" },
  { value: IncomeSource.Agriculture, label: "Income from Agriculture" },
  { value: IncomeSource.FinancialAsset, label: "Income from Financial Asset" },
  { value: IncomeSource.CapitalGain, label: "Income from Capital Gain" },
  { value: IncomeSource.OthersSource, label: "Income from Other Source" },
  {
    value: IncomeSource.ForignRemitance,
    label: "Income from Foreign Remittance",
  },
];

const QUERY_TAX_TYPE_TO_INCOME_SOURCE: Record<string, IncomeSource> = {
  income_tax: IncomeSource.PrivateJob,
  sales_tax: IncomeSource.Business,
  value_added_tax: IncomeSource.Business,
  service_tax: IncomeSource.Business,
  import_duty: IncomeSource.Business,
};

const CreateOrderPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const taxType = params.get("taxType") || "";
  const [createTaxStepOne, { isLoading: isCreatingOrder }] =
    useCreateTaxStepOneMutation();

  const { data: profileData } = useGetMeQuery(undefined, {
    selectFromResult: ({ data }) => ({
      data: data?.data,
    }),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      source_of_income: [],
      tax_year: CURRENT_YEAR.toString(),
      income_from_ldt_company: false,
      income_from_partnership_firm: false,
      are_you_get_notice_from_tax_office: false,
      for_other_person: false,
    },
  });

  useEffect(() => {
    if (profileData) {
      if (profileData.name && !form.getValues("name")) {
        form.setValue("name", profileData.name);
      }
      if (profileData.email && !form.getValues("email")) {
        form.setValue("email", profileData.email);
      }
      if (profileData.mobile && !form.getValues("mobile")) {
        form.setValue("mobile", profileData.mobile);
      }
    }
  }, [profileData, form]);

  useEffect(() => {
    const mapped = QUERY_TAX_TYPE_TO_INCOME_SOURCE[taxType];
    if (mapped && form.getValues("source_of_income").length === 0) {
      form.setValue("source_of_income", [mapped]);
    }
  }, [taxType, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const orderResponse = await createTaxStepOne({
        personal_iformation: {
          name: values.name,
          email: values.email,
          phone: values.mobile,
          are_you_student: false,
          are_you_house_wife: false,
        },
        tax_year: values.tax_year,
        source_of_income: values.source_of_income,
        income_from_ldt_company: values.income_from_ldt_company,
        income_from_partnership_firm: values.income_from_partnership_firm,
        are_you_get_notice_from_tax_office:
          values.are_you_get_notice_from_tax_office,
        for_other_person: values.for_other_person,
        is_self: !values.for_other_person,
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

  const selectedIncomeSources = useWatch({
    control: form.control,
    name: "source_of_income",
  });
  const selectedTaxYear = useWatch({
    control: form.control,
    name: "tax_year",
  });
  const forOtherPerson = useWatch({
    control: form.control,
    name: "for_other_person",
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
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
                <span>TAX STEP 1</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Create Tax Order
              </h1>
              <p className="text-slate-500 font-medium">
                Submit step-1 details to create your tax order draft.
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-800">
                Personal Information
              </h2>
              <FormField
                control={form.control}
                name={"for_other_person"}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {`This filing is for another person (e.g. family member)`}
                    </FormLabel>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          {...field}
                          disabled={!forOtherPerson}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={!forOtherPerson}
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 01712345678" {...field} />
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
                      <FormLabel>Tax Filing Year</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              className="w-full"
                              placeholder="Select year"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TAX_YEARS.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
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

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-800">
                Source of Income
              </h2>
              <FormField
                control={form.control}
                name="source_of_income"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {INCOME_SOURCES.map((source) => {
                        const checked = field.value.includes(source.value);
                        return (
                          <label
                            key={source.value}
                            className="flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer"
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(nextChecked) => {
                                if (nextChecked) {
                                  field.onChange([
                                    ...field.value,
                                    source.value,
                                  ]);
                                  return;
                                }
                                field.onChange(
                                  field.value.filter(
                                    (value) => value !== source.value,
                                  ),
                                );
                              }}
                            />
                            <span className="text-sm text-slate-700">
                              {source.label}
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

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-800">
                Additional Information
              </h2>
              {[
                {
                  name: "income_from_ldt_company" as const,
                  label: "Income from LTD company",
                },
                {
                  name: "income_from_partnership_firm" as const,
                  label: "Income from partnership firm",
                },
                {
                  name: "are_you_get_notice_from_tax_office" as const,
                  label: "Received notice from tax office",
                },
              ].map((option) => (
                <FormField
                  key={option.name}
                  control={form.control}
                  name={option.name}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <Card className="bg-slate-900 text-white rounded-3xl border-none shadow-xl overflow-hidden">
              <CardHeader className="pb-0">
                <CardTitle className="text-xl">Order Summary</CardTitle>
                <CardDescription className="text-slate-400">
                  Step 1 will create a draft order.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Income sources</span>
                    <span className="font-bold">
                      {selectedIncomeSources.length} selected
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tax year</span>
                    <span className="font-bold">{selectedTaxYear}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isCreatingOrder}
                  className="w-full h-14 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl"
                >
                  {isCreatingOrder ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Next
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

export default CreateOrderPage;
