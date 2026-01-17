"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import Link from "next/link";

const formSchema = z.object({
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^(\+8801|01)[3-9]\d{8}$/, "Invalid mobile number format"),
  tax_or_vat_number: z.string().min(1, "Tax/VAT number is required"),
  is_taxable_income: z.boolean(),
  tax_types: z.array(z.string()).min(1, "Select at least one tax type"),
  tax_year: z.string().min(1, "Tax year is required"),
});

type FormValues = z.infer<typeof formSchema>;

const CURRENT_YEAR = new Date().getFullYear();
const TAX_YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);

const CreateOrderPage = () => {
  const router = useRouter();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const { data: taxTypes } = useGetTaxTypesQuery(undefined, {
    selectFromResult: (result) => ({
      data: result.data?.data,
    }),
  });

  const taxTypeOptions = taxTypes?.map((type: any) => ({
    value: type._id,
    label: type.name,
  }));

  console.log(taxTypeOptions);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobile: "",
      tax_or_vat_number: "",
      is_taxable_income: false,
      tax_types: [],
      tax_year: CURRENT_YEAR.toString(),
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createOrder(values as any).unwrap();
      toast.success("Order created successfully");
      router.push("/profile/orders");
    } catch (error: any) {
      globalErrorHandler(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/profile/orders">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Order
          </h1>
          <p className="text-muted-foreground">
            Fill in the details to create a new tax order
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>
            Please provide accurate information for your tax order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="tax_types"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Tax Types</FormLabel>
                      <FormMessage />
                    </div>
                    <div className="space-y-3">
                      {taxTypeOptions?.map((item: any) => (
                        <FormField
                          key={item.value}
                          control={form.control}
                          name="tax_types"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.value}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            item.value,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.value
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
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
                name="tax_or_vat_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax/VAT Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tax or VAT number" {...field} />
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
                    <FormLabel>Tax Year</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tax year" />
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

              <FormField
                control={form.control}
                name="is_taxable_income"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Is Taxable Income</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Check this if you have taxable income for this year
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/profile/orders")}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Order
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateOrderPage;
