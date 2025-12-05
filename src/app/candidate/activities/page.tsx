"use client";

import React from "react";
import Image from "next/image";
import ActivityCard from "@/components/ui/activityCard";
import { useFetch } from "@/components/hooks/useFetch";
import LoadingScreen from "@/components/layout/loader";

export default function ActivitiesPage() {
  const { data, loading } = useFetch("/api/candidate/activities");

  if (loading) {
    return <LoadingScreen />;
  }

  const activities = data?.activities ?? [];
  const enrolledActivities = data?.enrolledActivities ?? [];

  if (activities.length === 0 && enrolledActivities.length === 0) {
    return (
      <section className="min-h-[90vh] pt-32 px-4 md:pt-0 md:px-6 lg:px-8 md:mt-6 lg:pt-0">
        <h2 className="text-4xl mb-8 font-bold">Activities</h2>
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
      {enrolledActivities?.length ? (
        <section>
          <section className="flex justify-between">
            <h2 className="font-bold text-xl ">
              Enrolled Activities/Courses ({enrolledActivities.length})
            </h2>
          </section>
          <section className="flex flex-wrap gap-4 mt-4">
            {enrolledActivities.map((activity: any) => (
              <ActivityCard key={activity.id} {...activity} />
            ))}
          </section>
        </section>
      ) : null}
      {enrolledActivities?.length > 0 && enrolledActivities?.length > 0 ? (
        <div className="my-8 " />
      ) : null}
      {activities?.length ? (
        <section>
          <section className="flex justify-between">
            {enrolledActivities?.length ? (
              <h2 className="font-bold text-xl ">
                Activities/Courses ({activities.length})
              </h2>
            ) : null}
          </section>
          <section
            className={`flex flex-wrap gap-4 ${
              enrolledActivities?.length ? "mt-4" : ""
            }`}
          >
            {activities.map((activity: any) => (
              <ActivityCard key={activity.id} {...activity} />
            ))}
          </section>
        </section>
      ) : null}
    </section>
  );
}
