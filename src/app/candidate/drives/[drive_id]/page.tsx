"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useFetch } from "@/components/hooks/useFetch";
import LoadingScreen from "@/components/layout/loader";
import Image from "next/image";
import { contrastColorMap } from "@/utils/contrastColorMap";
import { Button } from "@/components/ui/button";
// avoid importing prisma enums in client bundle; compare string values instead
import ActivityShortCard from "@/components/ui/activityShortCard";

export default function DrivePage() {
  const params = useParams();
  const router = useRouter();
  const driveId = params.drive_id as string;

  const { data, loading } = useFetch(`/api/candidate/drives/${driveId}`);

  const [isApplying, setIsApplying] = useState(false);

  const drive = data?.drive;

  const handleApply = async () => {
    if (isApplying) return;
    try {
      setIsApplying(true);
      const res = await fetch(`/api/candidate/drives/${driveId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        // handle prerequisite error specially
        if (res.status === 400 && body?.missing) {
          const missing = body.missing as Array<{ id: string; name: string }>;
          const names = missing.map((m) => m.name || m.id);
          toast.error(
            `Cannot enroll — missing prerequisites: ${names.join(", ")}`
          );
        } else {
          toast.error(body?.error || "Failed to apply for drive");
        }
        return;
      }

      // success — refresh page data or navigate as needed
      toast.success("Successfully enrolled in drive");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Network error while applying");
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!drive) {
    return (
      <section className="min-h-[90vh] pt-32 px-4 md:pt-0 md:px-6 lg:px-8 md:mt-6 lg:pt-0">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Image
            src={"/assets/images/backgrounds/no-data-bg.svg"}
            alt="decoration"
            width={500}
            height={500}
          />
          <p className="text-gray-600 mb-4">Drive not found</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Go back
          </button>
        </div>
      </section>
    );
  }

  const isMinimumCriteriaPresent =
    drive.allowed_sem ||
    drive.cgpa_greater_than ||
    (drive.departments && drive.departments?.length) ||
    drive.is_required;

  const stages = drive.drive_activities.filter(
    (activity: any) => activity.type === "STAGE"
  );

  const preRequisites = drive.drive_activities.filter(
    (activity: any) => activity.type === "PREREQUISITE"
  );

  return (
    <section className="min-h-[90vh] pt-32 px-4 md:pt-0 md:px-6 lg:px-8 md:mt-6 lg:pt-0">
      {/* Drive Header */}
      <div
        className="p-4 rounded-2xl shadow"
        style={{
          backgroundColor: drive.bg_color ?? "#205683",
          color: contrastColorMap[drive.bg_color],
        }}
      >
        {drive.tag && (
          <div
            className=" rounded-xl text-sm font-medium  inline-block px-2 py-1"
            style={{
              color: drive.bg_color ?? "#205683",
              backgroundColor: contrastColorMap[drive.bg_color],
            }}
          >
            {drive.tag}
          </div>
        )}
        <h1 className="text-3xl font-bold  mb-2">{drive.name}</h1>

        {/* Details */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold  mb-3">
            About the {drive?.company_name ?? "Company"}
          </h2>
          <p className=" leading-relaxed whitespace-pre-wrap">
            {drive.company_details}
          </p>
        </div>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6  my-6">
        {/* Requirements */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold  mb-3">Requirements</h2>
          <div className=" rounded-md">
            <p dangerouslySetInnerHTML={{ __html: drive.requirements }}></p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Key Points */}
          {drive.keypoints && drive.keypoints.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold ">Highlights</h2>
              <ul className="">
                {drive.keypoints.map((point: any, index: number) => (
                  <li key={index} className="flex items-start ">
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Eligibility Criteria */}
          {isMinimumCriteriaPresent ? (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                Eligibility Criteria
              </h2>
              <div
                className=" p-4 rounded-md space-y-2"
                style={{
                  backgroundColor: drive.bg_color,
                  color: contrastColorMap[drive.bg_color],
                }}
              >
                {drive.allowed_sem && (
                  <p>
                    <strong>Minimum Semester:</strong> {drive.allowed_sem}
                  </p>
                )}
                {drive.cgpa_greater_than && (
                  <p>
                    <strong>Minimum CGPA:</strong> {drive.cgpa_greater_than}
                  </p>
                )}
                {drive.is_required && (
                  <p className="text-red-600 font-medium">
                    ⚠ This drive is mandatory for eligible students
                  </p>
                )}
                {drive.departments?.length ? (
                  <p>
                    <strong>Eligible Departments:</strong>
                    {drive.departments?.map((dep: any) => dep.name).join(", ")}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </section>
      {preRequisites && preRequisites.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Required Activities
          </h2>
          <div className="space-y-4 flex flex-wrap gap-x-6 ">
            {preRequisites.map((driveActivity: any) => (
              <ActivityShortCard
                key={driveActivity.activity_id}
                {...driveActivity.activity}
              />
            ))}
          </div>
        </div>
      )}

      {stages && stages.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Stages</h2>
          <div className="flex flex-wrap gap-y-2 ">
            {stages.map((driveActivity: any, index: number) => (
              <div
                key={driveActivity.activity_id}
                className="flex items-center"
              >
                <ActivityShortCard
                  key={driveActivity.activity_id}
                  {...driveActivity.activity}
                />
                {index < stages.length - 1 && (
                  <svg
                    className="w-12 h-12 mx-2 shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Apply Button */}
      <div className="bg-white rounded-lg shadow-lg p-6 sticky bottom-0 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-gray-600 text-sm flex  gap-3 items-center">
              Ready to apply?
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className=" px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    color: drive.bg_color ?? "#205683",
                    backgroundColor: contrastColorMap[drive.bg_color],
                  }}
                >
                  {drive.available_positions} positions available
                </span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{drive.name}</p>
          </div>
          <Button disabled={isApplying} onClick={handleApply}>
            {isApplying ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-udyoga-blue" />
                <span>Applying...</span>
              </div>
            ) : (
              <span>Apply Now</span>
            )}

            {drive.baseprice && Number(drive.baseprice) > 0 ? (
              <div className="text-right">
                <p className="text-lg font-bold text-primary">
                  @ ₹{drive.baseprice}
                </p>
              </div>
            ) : null}
          </Button>
        </div>
      </div>
    </section>
  );
}
