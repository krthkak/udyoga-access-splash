"use client";

import React from "react";

import ActivityCard from "@/components/ui/activityCard";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import LoadingScreen from "@/components/layout/loader";
import { useFetch } from "@/components/hooks/useFetch";
import DriveCard from "@/components/ui/driveCard";
import Link from "next/link";

const getFormattedDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const weekday = date.toLocaleString("default", { weekday: "long" });

  const year = date.getFullYear();
  return `${weekday}, ${day} ${month} ${year}`;
};

export default function CandidateHomePage() {
  const { data: session } = useSession();

  const { data, loading } = useFetch(`/api/candidate`);

  if (loading) return <LoadingScreen />;

  const availableActivities: any[] = data?.available_activities ?? [];
  const availableDrives: any[] = data?.available_drives ?? [];
  const enrolledActivities: any[] = data?.enrolled_activities ?? [];
  const enrolledDrives: any[] = data?.enrolled_drives ?? [];

  return (
    <section className="min-h-[90vh] pt-32 px-4 md:pt-0 md:px-6 lg:px-8 md:mt-6 lg:pt-0 ">
      <div className="hidden  bg-linear-to-r from-udyoga-blue to-udyoga-yellow/30 rounded-xl text-white w-full md:flex justify-between relative mb-12">
        <section className="flex flex-col justify-between p-8 md:h-52">
          <small>{getFormattedDate()}</small>
          <section>
            <p className="text-4xl font-bold font-poppins-sans ">
              Hello, <span className="capitalize">{session?.user.name}</span>!
            </p>
            <p>Upskill your future</p>
          </section>
        </section>

        <section className="absolute right-0 ">
          <Image
            src="/assets/images/backgrounds/candidate-bg.svg"
            alt="decoration"
            width={300}
            height={300}
          />
        </section>
      </div>

      <section className="bg-udyoga-yellow/60 rounded-xl p-4 my-4 md:flex items-center justify-between">
        <section>
          <p className="font-bold font-poppins-sans">
            Activate Your Account Today!
          </p>
          <p>
            Unlock full access to all drives, courses and exclusive
            opportunities with a one-time activation payment of ₹12,000. Once
            verified, you&apos;ll be able to apply instantly.
          </p>
          <small>
            Note: Some drives may include additional participation fees.
          </small>
        </section>
        <Button className="uppercase">Pay now</Button>
      </section>
      <section className="flex flex-col gap-8 mb-16">
        {availableActivities?.length ? (
          <section>
            <section className="flex justify-between items-center">
              <h2 className="font-bold text-xl ">
                Activities/Courses ({availableActivities.length})
              </h2>
              <Link href={"/candidate/activities"}>
                <Button variant={"link"}>View All</Button>
              </Link>
            </section>
            <section className="flex flex-wrap gap-4 mt-2">
              {availableActivities.slice(0, 4).map((activity) => (
                <ActivityCard key={activity.id} {...activity.activity} />
              ))}
            </section>
          </section>
        ) : null}
        {availableDrives?.length ? (
          <section>
            <section className="flex justify-between items-center">
              <h2 className="font-bold text-xl ">
                Drives ({availableDrives.length})
              </h2>
              <Link href={"/candidate/drives"}>
                <Button variant={"link"}>View All</Button>
              </Link>
            </section>
            <section className="flex flex-wrap gap-4 mt-2">
              {availableDrives.map((drive) => (
                <DriveCard key={drive.id} {...drive.drive} />
              ))}
            </section>
          </section>
        ) : null}
        {enrolledActivities?.length ? (
          <section>
            <section className="flex justify-between">
              <h2 className="font-bold text-xl ">
                Enrolled Activities/Courses ({enrolledActivities.length})
              </h2>
            </section>
            <section className="flex flex-wrap gap-4 mt-4">
              {enrolledActivities.map((activity) => (
                <ActivityCard key={activity.id} {...activity.activity} />
              ))}
            </section>
          </section>
        ) : null}
        {enrolledDrives?.length ? (
          <section>
            <section className="flex justify-between">
              <h2 className="font-bold text-xl ">
                Enrolled Activities/Courses ({enrolledDrives.length})
              </h2>
            </section>
            <section className="flex flex-wrap gap-4 mt-4 ">
              {enrolledDrives.map((drive) => (
                <DriveCard key={drive.id} {...drive.drive} />
              ))}
            </section>
          </section>
        ) : null}
      </section>
    </section>
  );
}
