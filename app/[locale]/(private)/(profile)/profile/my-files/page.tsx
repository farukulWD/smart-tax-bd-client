"use client";

import { UploadDialog } from "./_components/upload-dialog";
import { useGetMyFilesQuery } from "@/redux/api/file/fileApi";
import { FileX } from "lucide-react";
import { useTranslations } from "next-intl";

const MyFilesPage = () => {
  const t = useTranslations("myFiles");
  const { data: files, isLoading } = useGetMyFilesQuery(undefined, {
    selectFromResult: (result) => ({
      data: result.data?.data,
      isLoading: result.isLoading,
    }),
  });

  const isEmpty = !isLoading && (!files || files.length === 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
        <UploadDialog />
      </div>

      {isEmpty && (
        <div className="flex flex-col items-center justify-center gap-6 rounded-xl border border-dashed bg-muted/30 py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <FileX className="h-10 w-10 text-primary/60" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{t("noFilesTitle")}</h3>
            <p className="text-sm text-muted-foreground">{t("noFilesDesc")}</p>
          </div>
          <UploadDialog />
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
};

export default MyFilesPage;
