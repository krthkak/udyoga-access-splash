"use client";

import React, { useMemo, useState } from "react";

import RevenueCard from "@/components/ui/revenueCard";
import { useFetch } from "@/components/hooks/useFetch";
import LoadingScreen from "@/components/layout/loader";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default function CollegeAdminHomePage() {
  const { data, loading } = useFetch("/api/college-admin");
  const [globalFilter, setGlobalFilter] = useState("");

  const filteredData = useMemo(() => {
    if (!data?.unverifiedStudents) {
      return [];
    }

    if (!globalFilter) return data.unverifiedStudents;
    return data.unverifiedStudents.filter(
      (student: any) =>
        student.student_id.toLowerCase().includes(globalFilter.toLowerCase()) ||
        (student?.user?.first_name &&
          student.user.first_name
            .toLowerCase()
            .includes(globalFilter.toLowerCase())) ||
        (student?.user?.last_name &&
          student.user.last_name
            .toLowerCase()
            .includes(globalFilter.toLowerCase())) ||
        (student?.department?.name &&
          student.department.name
            .toLowerCase()
            .includes(globalFilter.toLowerCase()))
    );
  }, [data?.unverifiedStudents, globalFilter]);

  if (!data) {
    return <div>Unauthorized</div>;
  }
  if (loading) {
    return <LoadingScreen />;
  }

  // Filter data based on search input

  return (
    <section className="min-h-[90vh] pt-32 px-4 md:px-6 lg:px-8 lg:pt-32 ">
      <section className="flex flex-wrap gap-4">
        <RevenueCard
          text="Total Activities"
          value={data?.activitiesCount ?? 0}
        />
        <RevenueCard text="Total Drives" value={data.drivesCount ?? 0} />
      </section>
      <section className="mt-8">
        <h2 className="font-bold text-xl ">Candidates By Department</h2>
        <section className="mt-2 gap-4 flex flex-wrap ">
          {data.candidateStats.map((stats: any) => (
            <div
              key={stats.departmentId}
              className="bg-udyoga-blue text-white p-4 rounded-lg"
            >
              <p className="font-bold">{stats.departmentName}</p>
              <div className="mt-2">
                <p>Total Candidates: {stats.totalCandidates}</p>
                <p>Unverified Candidates: {stats.unverifiedCandidates}</p>
                <p>Verified Candidates: {stats.verifiedCandidates}</p>
              </div>
            </div>
          ))}
        </section>
        <section className="mt-8">
          <h2 className="font-bold text-xl ">List of Unverified Candidates</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search students..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          <DataTable columns={columns} data={filteredData} />
        </section>
      </section>
    </section>
  );
}
