import React from "react";
import Link from "next/link";
import { DataTable } from "./data-table";
import { FEInstitution, columns } from "./columns";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { InstitutionService } from "@/services";

export default async function InstitutionHomePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/unauthorized"); // or handle however you want
  }

  // fetch institutions from service
  const institutions: FEInstitution[] = await InstitutionService.getAllByCount(
    true
  );
  return (
    <section className="min-h-[90vh] pt-32 px-4 md:px-6 lg:px-8 lg:pt-32">
      <div className="flex justify-end">
        <Link href={"/admin/institution/create"}>
          <Button className="uppercase">Create institution</Button>
        </Link>
      </div>
      <section className="flex flex-col gap-2">
        <div className="py-10 ">
          <DataTable columns={columns} data={institutions} />
        </div>
      </section>
    </section>
  );
}
