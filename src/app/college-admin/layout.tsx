"use client";

import React, { useEffect } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/layout/loader";
import CollegeAdminNavbar from "@/components/layout/collegeAdminNavbar";

export default function CollegeAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      return;
    }

    if (session.user.role === "college-admin") {
      return;
    } else {
      router.push("/");
    }
  }, [session, status]);

  if (status === "loading") return <LoadingScreen />;
  return (
    <>
      <CollegeAdminNavbar />
      <section> {children}</section>
    </>
  );
}
