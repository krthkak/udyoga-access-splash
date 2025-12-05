"use client";

import React, { useEffect } from "react";

import AdminNavbar from "@/components/layout/adminNavbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/layout/loader";

export default function AdminLayout({
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

    if (session.user.role === "admin") {
      return;
    } else if (session.user.role === "candidate") {
      if (session.user.status === "onboarding") {
        router.push("/");
      } else {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [session, status]);

  if (status === "loading") return <LoadingScreen />;
  return (
    <>
      <AdminNavbar />
      <section> {children}</section>
    </>
  );
}
