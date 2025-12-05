"use client";

import React from "react";
import Image from "next/image";
import { useFetch } from "@/components/hooks/useFetch";
import LoadingScreen from "@/components/layout/loader";
import DriveCard from "@/components/ui/driveCard";

interface Drive {
  id: string;
  name: string;
  available_positions: number;
  company_details: string;
  requirements: string;
  keypoints: string[];
  image: string;
  status: string;
  institution_drive_id: string;
  allowed_sem: number | null;
  cgpa_greater_than: number | null;
  is_required: boolean;
}

export default function DrivesPage() {
  const { data, loading } = useFetch("/api/candidate/drives");

  if (loading) {
    return <LoadingScreen />;
  }

  const drives = data?.drives ?? [];
  const enrolledDrives = data?.enrolledDrives ?? [];

  if (drives.length === 0 && enrolledDrives.length === 0) {
    return (
      <section className="min-h-[90vh] pt-32 px-4 md:pt-0 md:px-6 lg:px-8 md:mt-6 lg:pt-0">
        <h2 className="text-4xl mb-8 font-bold">Drives</h2>
        <section className="flex flex-col items-center mt-32">
          <Image
            src={"/assets/images/backgrounds/no-data-bg.svg"}
            alt="decoration"
            width={500}
            height={500}
          />
          <small>
            Hey there! Looks like your institution isn&apos;t set up with us
            yet, or no activities for your institution are live right now. Check
            back a bit later!
          </small>
        </section>
      </section>
    );
  }

  return (
    <section className="min-h-[90vh] pt-32 px-4 md:pt-0 md:px-6 lg:px-8 md:mt-6 lg:pt-0">
      {enrolledDrives?.length ? (
        <section>
          <section className="flex justify-between">
            <h2 className="font-bold text-xl ">
              Enrolled Drives ({enrolledDrives.length})
            </h2>
          </section>
          <section className="flex flex-wrap gap-4 mt-4">
            {enrolledDrives.map((drive: any) => (
              <DriveCard key={drive.id} {...drive} />
            ))}
          </section>
        </section>
      ) : null}
      {enrolledDrives?.length > 0 && drives?.length > 0 ? (
        <div className="my-8 " />
      ) : null}
      {drives?.length ? (
        <section>
          <section className="flex justify-between">
            {enrolledDrives.length > 0 ? (
              <h2 className="font-bold text-xl ">Drives ({drives.length})</h2>
            ) : null}
          </section>
          <section
            className={`flex flex-wrap gap-4 ${
              enrolledDrives?.length ? "mt-4" : ""
            }`}
          >
            {drives.map((drive: any) => (
              <DriveCard key={drive.id} {...drive} />
            ))}
          </section>
        </section>
      ) : null}
    </section>
  );
}
