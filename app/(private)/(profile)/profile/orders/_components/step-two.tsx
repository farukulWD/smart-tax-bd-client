"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  useGetTaxOrderByIdQuery,
  useUploadTaxStepTwoDocumentsMutation,
} from "@/redux/api/order/orderApi";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useGetMyFilesQuery,
  useUploadFileMutation,
} from "@/redux/api/file/fileApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { globalErrorHandler } from "@/helpers/globalErrorHandler";

const StepTwo = ({ taxId }: { taxId: string }) => {
  const [selectedRequiredDoc, setSelectedRequiredDoc] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  const [uploadFile, { isLoading: isUploadingFile }] = useUploadFileMutation();
  const [uploadTaxStepTwoDocuments, { isLoading: isSubmittingStepTwo }] =
    useUploadTaxStepTwoDocumentsMutation();
  const {
    data,
    isLoading,
    isError,
    refetch: refetchOrder,
  } = useGetTaxOrderByIdQuery(taxId ?? skipToken);

  const {
    data: myFilesResponse,
    isLoading: isFilesLoading,
    refetch: refetchMyFiles,
  } = useGetMyFilesQuery(undefined, {
    skip: !taxId,
  });

  const requiredDocuments = data?.data?.required_documents || [];
  const myFiles = myFilesResponse?.data || [];

  const latestFileByType = requiredDocuments.reduce(
    (acc, docType) => {
      const matchingFiles = myFiles
        .filter((file: any) => file.type === docType)
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        );
      if (matchingFiles[0]) {
        acc[docType] = matchingFiles[0];
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  const uploadedDocTypes = Object.keys(latestFileByType);
  const missingDocuments = requiredDocuments.filter(
    (doc) => !uploadedDocTypes.includes(doc),
  );

  const stepTwoReady =
    requiredDocuments.length > 0 && missingDocuments.length === 0;

  useEffect(() => {
    if (taxId) {
      router.prefetch(`/profile/orders/create/${taxId}/payment`);
    }
  }, [taxId, router]);

  const handleUploadRequiredDocument = async () => {
    if (!selectedRequiredDoc) {
      toast.error("Select a required document type");
      return;
    }
    if (!selectedFile) {
      toast.error("Select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        name: selectedRequiredDoc,
        type: selectedRequiredDoc,
        orderId: taxId,
      }),
    );
    formData.append("file", selectedFile);

    try {
      await uploadFile(formData).unwrap();
      toast.success(`${selectedRequiredDoc} uploaded`);
      setSelectedFile(null);
      setSelectedRequiredDoc("");
      await refetchMyFiles();
      await refetchOrder();
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.data?.error ||
        error?.message ||
        "Document upload failed";
      toast.error(message);
      globalErrorHandler(error);
    }
  };

  const handleSubmitStepTwo = async () => {
    if (!taxId) return;
    if (!stepTwoReady) {
      const missing = missingDocuments.join(", ");
      toast.error(
        missing
          ? `Upload required documents first: ${missing}`
          : "Upload all required documents first",
      );
      return;
    }

    const documentIds = requiredDocuments
      .map((doc) => latestFileByType[doc]?._id)
      .filter(Boolean);

    if (!documentIds.length) {
      toast.error("No uploaded document IDs found for step 2 submission");
      return;
    }

    try {
      await uploadTaxStepTwoDocuments({
        taxId,
        documentIds,
      }).unwrap();
      toast.success("Step 2 completed successfully");
      router.push(`/profile/orders/create/${taxId}/payment`);
      await refetchOrder();
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.data?.error ||
        error?.message ||
        "Step 2 submission failed";
      toast.error(message);
      globalErrorHandler(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Step 2: Documents
          </h1>
          <p className="text-muted-foreground">
            Upload and submit the required tax documents.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {requiredDocuments?.map((doc) => {
              const file = latestFileByType[doc];
              return (
                <div
                  key={doc}
                  className={cn(
                    "flex items-center justify-between border rounded-lg px-3 py-2",
                    file
                      ? "bg-green-50 border-green-200"
                      : "bg-amber-50 border-amber-200",
                  )}
                >
                  <span className="text-sm font-medium">{doc}</span>
                  {file ? (
                    <a
                      href={file.file}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-green-700 underline"
                    >
                      Uploaded
                    </a>
                  ) : (
                    <Badge variant="secondary">Missing</Badge>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select
              value={selectedRequiredDoc}
              onValueChange={setSelectedRequiredDoc}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select required document" />
              </SelectTrigger>
              <SelectContent>
                {missingDocuments.map((doc) => (
                  <SelectItem key={doc} value={doc}>
                    {doc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="file"
              accept="image/*,application/pdf"
              onChange={(event) =>
                setSelectedFile(event.target.files?.[0] || null)
              }
            />
            <Button
              type="button"
              disabled={
                isUploadingFile || !selectedRequiredDoc || !selectedFile
              }
              onClick={handleUploadRequiredDocument}
            >
              {isUploadingFile && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Upload
            </Button>
          </div>

          {!stepTwoReady && (
            <p className="text-xs text-amber-600">
              Missing: {missingDocuments.join(", ")}
            </p>
          )}
          <Button
            type="button"
            className="w-full"
            disabled={isSubmittingStepTwo || isFilesLoading}
            onClick={handleSubmitStepTwo}
          >
            {isSubmittingStepTwo && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Go To Payment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepTwo;
