import React from "react";

import Link from "next/link";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { FEDrive, columns } from "./columns";
import { DriveService } from "@/services";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ActivityHomePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/unauthorized"); // or handle however you want
  }

  const drives: FEDrive[] = await DriveService.getAll();
  return (
    <section className="min-h-[90vh] pt-32 px-4 md:px-6 lg:px-8 lg:pt-32">
      <div className="flex justify-end">
        <Link href={"/admin/drives/create"}>
          <Button className="uppercase">Create Drive</Button>
        </Link>
      </div>
      <section className="flex flex-col gap-2">
        <div className="py-10 ">
          <DataTable columns={columns} data={drives} />
        </div>
      </section>
    </section>
  );
}
