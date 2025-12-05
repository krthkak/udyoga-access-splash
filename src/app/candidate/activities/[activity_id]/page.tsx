"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFetch } from "@/components/hooks/useFetch";
import LoadingScreen from "@/components/layout/loader";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { contrastColorMap } from "@/utils/contrastColorMap";
import Link from "next/link";

export default function ActivityPage() {
  const params = useParams();
  const router = useRouter();
  const activityId = params.activity_id as string;

  const { data, loading, refetch } = useFetch(
    `/api/candidate/activities/${activityId}`
  );

  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  // if (data.candidate_activity || data.candidate_activity_id) {
  //   setEnrolled(true);
  // }

  const handleEnroll = async () => {
    if (!activityId) return;
    setEnrollLoading(true);
    setEnrollError(null);

    try {
      const res = await fetch(`/api/candidate/activities/${activityId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.error || "Failed to enroll");
      }
      await refetch();
    } catch (err) {
      setEnrollError(err instanceof Error ? err.message : "Enrollment failed");
    } finally {
      setEnrollLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!data?.activity) {
    return (
      <section className="min-h-[90vh] pt-32 px-4 md:pt-0 md:px-6 lg:px-8 md:mt-6 lg:pt-0">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Image
            src={"/assets/images/backgrounds/no-data-bg.svg"}
            alt="decoration"
            width={500}
            height={500}
          />
          <p className="text-gray-600 mb-4">Activity not found</p>
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

  const activity = data.activity;
  const enrolled = data.candidate_activity || data.candidate_activity_id;

  const isMinimumCriteriaPresent =
    activity.allowed_sem ||
    activity.cgpa_greater_than ||
    (activity.departments && activity.departments?.length) ||
    activity.is_required;

  return (
    <section className="min-h-[90vh] pt-32 px-4 md:pt-0 md:px-6 lg:px-8 md:mt-6 lg:pt-0">
      {/* Activity Header */}
      <div
        className="p-4 rounded-2xl shadow"
        style={{
          backgroundColor: activity.bg_color ?? "#205683",
          color: contrastColorMap[activity.bg_color],
        }}
      >
        {activity.tag && (
          <div
            className=" rounded-xl text-sm font-medium  inline-block px-2 py-1"
            style={{
              color: activity.bg_color ?? "#205683",
              backgroundColor: contrastColorMap[activity.bg_color],
            }}
          >
            {activity.tag}
          </div>
        )}
        <h1 className="text-3xl font-bold  mb-2">{activity.name}</h1>

        {/* Details */}
        <div className="mb-6">
          <p className=" leading-relaxed whitespace-pre-wrap">
            {activity.description}
          </p>
        </div>
      </div>
      {activity.external_url ? (
        <div className="mt-8 flex justify-end">
          <Link href={activity.external_url}>
            <Button variant={"outline"}>Link to course</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow p-4 mt-8">
          <small className="font-bold">Important</small>
          <p>
            Once Enrolled to the activity, you will be contacted by the
            coordinator on the further details of the activity.
          </p>
        </div>
      )}
      {/* Key Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-8 gap-6 ">
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold  mb-3">About</h2>
          <p
            className="rich-text-editor"
            dangerouslySetInnerHTML={{ __html: activity.details }}
          ></p>
        </div>
        <div className=" rounded-2xl shadow p-4 bg-white">
          {activity.keypoints && activity.keypoints.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold  mb-3">Highlights</h2>
              <ul className="grid grid-cols-1 gap-2">
                {activity.keypoints.map((point: string, index: number) => (
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
              <h2 className="text-xl font-semibold  mb-3">
                Eligibility Criteria
              </h2>
              <div
                className="p-4 rounded-md space-y-2"
                style={{
                  backgroundColor: activity.bg_color,
                  color: contrastColorMap[activity.bg_color],
                }}
              >
                {activity.allowed_sem && (
                  <p>
                    <strong>Minimum Semester:</strong> {activity.allowed_sem}
                  </p>
                )}
                {activity.cgpa_greater_than && (
                  <p>
                    <strong>Minimum CGPA:</strong> {activity.cgpa_greater_than}
                  </p>
                )}
                {activity.departments && (
                  <p>
                    <strong>Eligible departments:</strong>{" "}
                    {activity.departments
                      ?.map((dep: any) => dep.name)
                      .join(", ")}
                  </p>
                )}
                {activity.is_required && (
                  <p className="text-red-600 font-medium">
                    ⚠ This activity is mandatory for eligible students
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="text-right">
        <p className="text-2xl font-bold text-primary"></p>
      </div>

      {/* Enroll Button */}
      <div className="mt-8">
        <div className="flex justify-end ">
          <div className="flex flex-col items-end gap-2">
            {enrollError && (
              <p className="text-sm text-red-600">{enrollError}</p>
            )}
            <Button
              onClick={handleEnroll}
              disabled={enrollLoading || enrolled}
              className={`px-8 py-3 rounded-md font-semibold transition-colors ${
                enrolled ? " cursor-not-allowed" : "  hover:bg-primary/90"
              }`}
            >
              {enrollLoading
                ? "Enrolling..."
                : enrolled
                ? "Enrolled"
                : `Enroll  ${
                    Number(activity.baseprice) === 0
                      ? "for Free"
                      : `@ ₹ ${Number(activity.baseprice).toFixed(2)}`
                  }`}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
