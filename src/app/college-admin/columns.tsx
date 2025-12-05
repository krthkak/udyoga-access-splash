"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface FEStudent {
  id: string;
  student_id: string;
  first_name?: string;
  last_name?: string;
  semester: number;
  department_name: string;
}

export const columns: ColumnDef<FEStudent>[] = [
  {
    accessorKey: "student_id",
    header: "Student ID",
  },
  {
    accessorKey: "user.first_name",
    header: "First Name",
  },
  {
    accessorKey: "user.last_name",
    header: "Last Name",
  },
  {
    accessorKey: "user.email",
    header: "Email",
  },
  {
    accessorKey: "semester",
    header: "Semester",
  },
  {
    accessorKey: "department.name",
    header: "Department",
  },
];
