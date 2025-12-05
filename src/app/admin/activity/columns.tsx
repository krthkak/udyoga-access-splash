"use client";

import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { Edit2 } from "lucide-react";
import Link from "next/link";
import { EntityStatus } from "@prisma/client";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type FEActivity = {
  name: string;
  id: string;
  updated_date: Date | null;
  status: EntityStatus;
  _count: {
    candidate_activities: number;
  };
};

export const columns: ColumnDef<FEActivity>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "_count.candidate_activities",
    header: "No. of Students",
  },
  {
    accessorKey: "updated_date",
    header: "Last Updated Date",
    cell: (cell) => (cell.getValue() as Date).toLocaleString(),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "id",
    header: "Actions",
    cell: (cell) => (
      <Link href={`/admin/activity/${cell.getValue() as string}/edit`}>
        <Edit2 />
      </Link>
    ),
  },
];
