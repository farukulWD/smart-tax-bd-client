"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { DeleteFileAction } from "./delete-file-action";

export type FileData = {
  _id: string; // Assuming there is an ID, though not explicitly shown in user snippet, usually present.
  name: string;
  type: string;
  file: string;
  createdAt: string;
};

export const columns: ColumnDef<FileData>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return <span className="capitalize">{type.replace(/_/g, " ")}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return format(date, "PPpp");
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const fileUrl = row.original.file;
      const fileId = row.original._id;
      const fileName = row.original.name;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.open(fileUrl, "_blank")}
            title="View File"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <DeleteFileAction fileId={fileId} fileName={fileName} />
        </div>
      );
    },
  },
];
