"use client";

import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type FEInstitution = {
  name: string;
  id: string;
  status: string;
  city: string | null;
  state: string | null;
  updated_date: Date | null;
  contact_person: string | null;
  contact_phone_details: string | null;
};

export const columns: ColumnDef<FEInstitution>[] = [
  {
    accessorKey: "name",
    header: "Name",
    enableColumnFilter: true,
    cell: (cell) => (
      <Link
        href={`/admin/institution/${cell.row.original.id}`}
        className="text-udyoga-blue underline font-bold"
      >
        {cell.getValue() as string}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "_count.candidates",
    header: "No. of Students",
  },
  {
    accessorKey: "_count.institution_drives",
    header: "No. of Drives",
  },
  {
    accessorKey: "_count.institution_activities",
    header: "No. of Activities",
  },
  {
    accessorKey: "updated_date",
    header: "Last Updated Date",
    cell: (cell) => (cell?.getValue() as Date)?.toLocaleString(),
  },
];
