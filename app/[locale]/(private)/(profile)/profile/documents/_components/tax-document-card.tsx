"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ITaxDocument } from "@/redux/api/file/fileApi";
import { Download, ExternalLink, FileCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const downloadFile = async (url: string, name: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(objectUrl);
  } catch {
    window.open(url, "_blank");
  }
};

export const TaxDocumentCard = ({ document }: { document: ITaxDocument }) => {
  const t = useTranslations("taxDocuments");
  const locale = useLocale();
  const issuedOn = new Date(document.createdAt).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <FileCheck className="h-6 w-6 text-primary" />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-semibold" title={document.name}>
              {document.name}
            </p>
            <Badge variant="secondary">{document.type}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("issuedOn", { date: issuedOn })}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={document.file} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              {t("view")}
            </a>
          </Button>
          <Button
            size="sm"
            onClick={() => downloadFile(document.file, document.name)}
          >
            <Download className="mr-2 h-4 w-4" />
            {t("download")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
