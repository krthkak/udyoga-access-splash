"use client";

import React, { useEffect } from "react";

import CandidateNavbar from "@/components/layout/candidateNavbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/layout/loader";

export default function CandidateLayout({
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

    // Redirect based on role and status
    if (session.user.role === "admin") {
      router.push("/");
    } else if (session.user.role === "college-admin") {
      router.push("/");
    } else if (session.user.role === "candidate") {
      if (session.user.status === "onboarding") {
        router.push("/candidate/onboarding");
      }
    }
  }, [session, status]);

  if (status === "loading") return <LoadingScreen />;
  return (
    <section className="md:flex ">
      <CandidateNavbar />
      <section className="md:not-only:w-10/12"> {children}</section>
    </section>
  );
}
