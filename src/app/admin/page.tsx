"use client";

import React from "react";

import RevenueCard from "@/components/ui/revenueCard";
import { useState } from "react";
import Select from "react-select";

export default function AdminHomePage() {
  const [institution, setInstitutions] = useState();
  const [options] = useState([]);

  return (
    <section className="min-h-[90vh] pt-32 px-4 md:px-6 lg:px-8 lg:pt-32 ">
      <div className="flex justify-end mb-7">
        <Select
          value={institution}
          options={options}
          onChange={(e: any) => {
            setInstitutions(e);
          }}
          classNames={{ control: () => "w-[30ch] h-12" }}
        />
      </div>
      <section className="flex flex-wrap gap-4">
        <RevenueCard text="Total Revenue" value={180000000} />
        <RevenueCard text="Total Students Enrolled" value={6000} />
      </section>
      <section className="mt-8">
        <h2 className="font-bold text-xl ">Drives</h2>
        <section className="mt-2 gap-4 flex md:w-1/2">
          <RevenueCard text="Total Revenue" value={180000000} />
          <RevenueCard text="Total Students Enrolled" value={6000} />
          <RevenueCard text="Total Students Enrolled" value={6000} />
          <RevenueCard text="Total Students Enrolled" value={6000} />
        </section>
      </section>
    </section>
  );
}
