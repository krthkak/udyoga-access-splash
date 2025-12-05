"use client";

import React from "react";

import Image from "next/image";
import Link from "next/link";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingScreen from "@/components/layout/loader";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      return;
    }

    if (session.user.role === "admin") {
      router.push("/admin/");
    } else if (session.user.role === "college-admin") {
      router.push("/college-admin/");
    } else if (session.user.role === "candidate") {
      if (session.user.status === "onboarding") {
        router.push("/candidate/onboarding");
      } else {
        router.push("/candidate/");
      }
    }
  }, [session, status]);

  if (status === "loading") return <LoadingScreen />;

  return session ? (
    <LoadingScreen />
  ) : (
    <>
      <header className="flex justify-between items-center px-4 md:px-6 lg:px-8 fixed w-full">
        <Link href={"/"}>
          <Image
            src={"/assets/logos/logo.png"}
            alt="udyoga-access"
            width={100}
            height={80}
          />
        </Link>
      </header>
      <section className="min-h-[90vh] pt-24 flex flex-col gap-8 md:gap-0 md:flex-row  md:pt-16 items-center px-4 md:px-6 lg:px-8 ">
        <section className="md:w-1/2 md:flex flex-col items-center justify-center">
          <section className="space-y-4 lg:w-1/2 bg-udyoga-blue-100 p-8 rounded-3xl flex flex-col justify-center items-center gap-8 inset-shadow-sm">
            <h1 className="text-2xl font-bold font-poppins-sans text-center">
              Sign In
            </h1>
            <section className="grid gap-3">
              <GoogleSignInButton />
            </section>
            <small className="text-center block font-light">
              By signing in you agree to our{" "}
              <Link
                className="underline text-udyoga-blue"
                href={"/terms-conditions"}
              >
                terms & conditions
              </Link>
              .
            </small>
          </section>
        </section>
        <section className="md:w-1/2">
          <Image
            className="w-full h-full"
            src={"/assets/images/backgrounds/login-bg.svg"}
            alt="decoration"
            width={300}
            height={400}
          />
        </section>
      </section>
    </>
  );
}
