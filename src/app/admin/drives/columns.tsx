"use client";

import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { Edit2 } from "lucide-react";
import Link from "next/link";
import { Drive } from "@prisma/client";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface FEDrive extends Pick<Drive, "id" | "name" | "updated_date"> {}

export const columns: ColumnDef<FEDrive>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },

  {
    accessorKey: "_count.candidate_drives",
    header: "No. of Students",
  },
  {
    accessorKey: "updated_date",
    header: "Last Updated Date",
    cell: (cell) => (cell.getValue() as Date).toLocaleString(),
  },
  {
    accessorKey: "id",
    header: "Actions",
    cell: (cell) => (
      <Link href={`/admin/drives/${cell.getValue() as string}/edit`}>
        <Edit2 />
      </Link>
    ),
  },
];
