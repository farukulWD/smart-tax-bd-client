"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  useGetTaxOrderByIdQuery,
  useUploadTaxStepTwoDocumentsMutation,
} from "@/redux/api/order/orderApi";
import { Download, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useGetMyFilesQuery,
  useUploadFileMutation,
} from "@/redux/api/file/fileApi";
import { useEffect, useRef, useState, ChangeEvent } from "react";
import { toast } from "sonner";
import { globalErrorHandler } from "@/helpers/globalErrorHandler";
import { useTranslations } from "next-intl";

const StepTwo = ({ taxId }: { taxId: string }) => {
  const t = useTranslations("stepTwo");
  const [activeDocToUpload, setActiveDocToUpload] = useState("");
  const [previewFile, setPreviewFile] = useState<{
    url: string;
    name?: string;
    type: "image" | "pdf" | "other";
  } | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hoveredViewDoc, setHoveredViewDoc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const [uploadFile, { isLoading: isUploadingFile }] = useUploadFileMutation();
  const [uploadTaxStepTwoDocuments, { isLoading: isSubmittingStepTwo }] =
    useUploadTaxStepTwoDocumentsMutation();
  const { data, refetch: refetchOrder } = useGetTaxOrderByIdQuery(
    taxId ?? skipToken,
  );

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

  const openPreview = (
    url: string,
    name: string,
    type: "image" | "pdf" | "other",
  ) => {
    setPreviewFile({ url, name, type });
    setIsPreviewOpen(true);
  };

  const downloadFile = async (url: string, name?: string) => {
    try {
      setIsDownloading(true);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to download (HTTP ${res.status})`);
      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = name || "download";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      toast.error(err?.message || "Download failed");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleMissingDocClick = (doc: string) => {
    if (isUploadingFile) return;
    setActiveDocToUpload(doc);
    fileInputRef.current?.click();
  };

  const uploadRequiredDocument = async (doc: string, file: File) => {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        name: doc,
        type: doc,
        orderId: taxId,
      }),
    );
    formData.append("file", file);

    try {
      await uploadFile(formData).unwrap();
      toast.success(`${doc} uploaded`);
      setActiveDocToUpload("");
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

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!activeDocToUpload) return;
    if (!file) return;

    await uploadRequiredDocument(activeDocToUpload, file);

    // Reset so users can re-select the same file if needed
    event.target.value = "";
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
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("requiredDocuments")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {requiredDocuments?.map((doc) => {
              const file = latestFileByType[doc];
              const fileUrl = file?.file;
              const isActive = activeDocToUpload === doc;
              const isImage =
                !!fileUrl && /\.(jpe?g|png|gif|webp|svg)$/i.test(fileUrl);
              const isPdf = !!fileUrl && /\.pdf$/i.test(fileUrl);

              return (
                <div
                  key={doc}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleMissingDocClick(doc)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      handleMissingDocClick(doc);
                    }
                  }}
                  className={cn(
                    "relative group flex flex-col justify-between border rounded-lg p-4 aspect-square",
                    "cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500",
                    file
                      ? "bg-green-50 border-green-200"
                      : "bg-amber-50 border-amber-200",
                  )}
                >
                  <div className="flex flex-col gap-3 h-full">
                    <div className="flex-1 w-full overflow-hidden rounded bg-white/30 flex items-center justify-center">
                      {file ? (
                        isImage ? (
                          <div className="relative h-full w-full">
                            <Image
                              src={fileUrl}
                              alt={doc}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : isPdf ? (
                          <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                            <span className="font-semibold">PDF</span>
                            <span className="truncate max-w-[90px]">
                              {file.name || "Document"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {t("fileUploaded")}
                          </span>
                        )
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {t("noFileYet")}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-sm font-medium">{doc}</span>
                      <p className="text-xs text-muted-foreground">
                        {file ? t("clickToReplace") : t("clickToUpload")}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      {file ? (
                        <button
                          type="button"
                          className="text-base py-0.5 px-3 rounded-md bg-green-200 text-green-700 w-full"
                          onClick={(event) => {
                            event.stopPropagation();
                            openPreview(
                              fileUrl,
                              file.name || doc,
                              isImage ? "image" : isPdf ? "pdf" : "other",
                            );
                          }}
                          onMouseEnter={() => setHoveredViewDoc(doc)}
                          onMouseLeave={() => setHoveredViewDoc(null)}
                        >
                          {t("view")}
                        </button>
                      ) : (
                        <Badge variant="secondary">{t("missing")}</Badge>
                      )}
                      {isUploadingFile && isActive ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : null}
                    </div>
                  </div>

                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center bg-black/20 rounded-md transition pointer-events-none",
                      hoveredViewDoc === doc
                        ? "opacity-0"
                        : "opacity-0 group-hover:opacity-100",
                    )}
                  >
                    <span className="text-sm font-semibold text-white">
                      {t("replace")}
                    </span>
                  </div>

                  <span
                    className={cn(
                      "absolute inset-0 rounded-lg pointer-events-none",
                      isActive ? "ring-2 ring-indigo-500" : "",
                    )}
                  />
                </div>
              );
            })}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleFileSelected}
          />

          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{previewFile?.name || t("previewTitle")}</DialogTitle>
                <DialogDescription>
                  {previewFile?.type === "image" && t("previewImageDesc")}
                  {previewFile?.type === "pdf" && t("previewPdfDesc")}
                  {previewFile?.type === "other" && t("previewOtherDesc")}
                </DialogDescription>
              </DialogHeader>

              <div className="h-[50vh] w-full rounded border bg-muted p-2">
                {previewFile ? (
                  previewFile.type === "image" ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={previewFile.url}
                        alt={previewFile.name || t("previewTitle")}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : previewFile.type === "pdf" ? (
                    <object
                      data={previewFile.url}
                      type="application/pdf"
                      className="h-full w-full"
                    >
                      <div className="flex h-full flex-col items-center justify-center gap-3 text-center p-4">
                        <p className="text-sm text-muted-foreground">
                          {t("pdfNotInBrowser")}
                        </p>
                        <a
                          href={previewFile.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
                        >
                          {t("openPdfNewTab")}
                        </a>
                      </div>
                    </object>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-sm text-muted-foreground">
                      <p>{t("previewNotAvailable")}</p>
                      <p>{t("downloadToView")}</p>
                    </div>
                  )
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    {t("noPreview")}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  {t("close")}
                </Button>
                {previewFile && (
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isDownloading}
                    onClick={() =>
                      downloadFile(previewFile.url, previewFile.name)
                    }
                    className="inline-flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {isDownloading ? t("downloading") : t("download")}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {!stepTwoReady && (
            <p className="text-xs text-amber-600">
              {t("missingDocs")} {missingDocuments.join(", ")}
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
            {t("goToPayment")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepTwo;
