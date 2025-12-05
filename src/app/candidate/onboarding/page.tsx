"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { useFetch } from "@/components/hooks/useFetch";
import LoadingScreen from "@/components/layout/loader";
import { useSession } from "next-auth/react";

// ✅ Zod Schema
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z
    .string() // input is string
    .refine((val) => !isNaN(Number(val)), { message: "Age must be a number" }) // check valid number
    .transform((val) => Number(val)) // convert to number
    .refine((num) => num >= 1 && num <= 99, {
      message: "Age must be between 1 and 99",
    }),
  gender: z.enum(["male", "female", "others"], "Gender is required"),
  studentId: z.string().min(1, "Student ID is required"),

  institution: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    "Institution is required"
  ),

  department: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    "Department is required"
  ),

  semester: z.object(
    {
      value: z.number(),
      label: z.string(),
    },
    "Semester is required"
  ),
});

type FormDataOnboarding = z.infer<typeof formSchema>;

export const semesterOptions = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
];

export interface DropdownOptions {
  value: string;
  label: string;
}

export default function OnBoardingPage() {
  const { data: session, update, status } = useSession();
  const router = useRouter();

  const [firstNamePreview, setFirstNamePreview] = useState("");
  const [brightness, setBrightness] = useState(0.3);

  const { data, loading } = useFetch<{
    departments: DropdownOptions[];
    institutions: DropdownOptions[];
  }>("/api/candidate/onboarding");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormDataOnboarding>({
    resolver: zodResolver(formSchema) as any,
  });

  const watchedValues = watch();

  useEffect(() => {
    const totalFields = 7;
    let filled = 0;

    if (watchedValues.firstName) filled++;
    if (watchedValues.lastName) filled++;
    if (watchedValues.age) filled++;
    if (watchedValues.gender) filled++;
    if (watchedValues.studentId) filled++;
    if (watchedValues.institution?.value) filled++;
    if (watchedValues.department?.value) filled++;
    if (watchedValues.semester?.value) filled++;

    const ratio = filled / totalFields;

    const newBrightness = 0.3 + ratio * 0.7;
    setBrightness(newBrightness);
  }, [watchedValues]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      return;
    }

    if (session.user.role === "admin") {
      router.push("/");
    } else if (session.user.role === "candidate") {
      if (session.user.status === "onboarding") {
        router.push("/candidate/onboarding");
      } else {
        router.push("/candidate/");
      }
    } else {
      router.push("/");
    }
  }, [session, status]);

  const onSubmit: SubmitHandler<FormDataOnboarding> = async (data) => {
    try {
      const req = await fetch("/api/candidate/onboarding", {
        method: "POST",
        body: JSON.stringify({
          ...data,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const res = await req.json();

      if (req.status !== 200) {
        toast.error(res.message ?? "Something went wrong!");
        return;
      }

      if (!res) {
        toast.error(res.message ?? "Something went wrong!");
        return;
      }

      await update();

      router.push("/candidate/");
    } catch (err) {
      toast.error((err as any).message ?? "something went wrong!");
    }
  };

  if (loading || status === "loading") {
    return <LoadingScreen />;
  }

  return (
    <section className="mb-32 pt-4 px-4 md:pt-0 md:px-6 lg:px-8 md:mt-6 lg:pt-0 w-full min-h-[80vh] md:flex relative">
      <section className="md:w-1/2">
        <div className="font-bold font-poppins-sans text-2xl md:text-4xl lg:text-6xl break-all">
          Hello
          {firstNamePreview ? (
            <>
              {" "}
              <span className="capitalize">{firstNamePreview}</span>,
            </>
          ) : (
            ","
          )}
        </div>
        <small>We would like some of your details to set up your account</small>

        <form onSubmit={handleSubmit(onSubmit as any)} className="mt-8 ">
          {/* PERSONAL DETAILS */}
          <section className="md:flex md:flex-col gap-8">
            <section className="">
              <h3 className="text-xl font-poppins-sans font-bold">
                Who are you?
              </h3>
              <section className="grid gap-4 p-2">
                {/* First + Last Name */}
                <section className="lg:flex w-full gap-6">
                  <div className="lg:w-1/2">
                    <Label>First Name *</Label>
                    <Input
                      className="mt-2"
                      {...register("firstName")}
                      onChange={(e) => {
                        setFirstNamePreview(e.target.value);
                        register("firstName").onChange(e);
                      }}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="lg:w-1/2">
                    <Label>Last Name *</Label>
                    <Input className="mt-2" {...register("lastName")} />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </section>

                {/* Age + Gender */}
                <section className="lg:flex w-full gap-6">
                  <div className="lg:w-1/2">
                    <Label>Age *</Label>
                    <Input
                      type="number"
                      className="mt-2"
                      {...register("age")}
                    />
                    {errors.age && (
                      <p className="text-red-500 text-sm">
                        {errors.age.message}
                      </p>
                    )}
                  </div>

                  <div className="lg:w-1/2">
                    <Label>Gender *</Label>
                    <div className="flex gap-4 mt-2 md:h-12 items-center">
                      {["male", "female", "others"].map((g) => (
                        <label key={g} className="flex items-center gap-1">
                          <input
                            type="radio"
                            value={g}
                            {...register("gender")}
                            className="accent-udyoga-blue"
                          />{" "}
                          <span className="capitalize">{g}</span>
                        </label>
                      ))}
                    </div>
                    {errors.gender && (
                      <p className="text-red-500 text-sm">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                </section>
              </section>
            </section>

            {/* COLLEGE DETAILS */}
            <section className="">
              <h3 className="text-xl font-poppins-sans font-bold">
                Where are you studying?
              </h3>
              <section className="grid gap-4 p-2">
                {/* Student ID + Institution */}
                <section className="lg:flex w-full gap-6">
                  <div className="lg:w-1/2">
                    <Label>Student ID *</Label>
                    <Input className="mt-2" {...register("studentId")} />
                    {errors.studentId && (
                      <p className="text-red-500 text-sm">
                        {errors.studentId.message}
                      </p>
                    )}
                  </div>

                  <div className="lg:w-1/2">
                    <Label>Institution *</Label>
                    <Controller
                      control={control}
                      name="institution"
                      render={({ field }) => (
                        <CreatableSelect
                          {...field}
                          options={data?.institutions}
                          className="mt-2"
                          placeholder="Select institution"
                          classNames={{ control: () => "h-12" }}
                          isSearchable
                          onChange={(val) => field.onChange(val)}
                        />
                      )}
                    />
                    {errors.institution && (
                      <p className="text-red-500 text-sm">
                        {errors.institution.message as string}
                      </p>
                    )}
                  </div>
                </section>

                {/* Department + Semester */}
                <section className="lg:flex w-full gap-6">
                  <div className="lg:w-1/2">
                    <Label>Department *</Label>
                    <Controller
                      control={control}
                      name="department"
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="mt-2"
                          classNames={{ control: () => "h-12" }}
                          options={data?.departments}
                          placeholder="Select department"
                          onChange={(val) => field.onChange(val)}
                        />
                      )}
                    />
                    {errors.department && (
                      <p className="text-red-500 text-sm">
                        {errors.department.message as string}
                      </p>
                    )}
                  </div>

                  <div className="lg:w-1/2">
                    <Label>Semester *</Label>
                    <Controller
                      control={control}
                      name="semester"
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="mt-2"
                          classNames={{ control: () => "h-12" }}
                          options={semesterOptions}
                          placeholder="Select semester"
                          onChange={(val) => field.onChange(val)}
                        />
                      )}
                    />
                    {errors.semester && (
                      <p className="text-red-500 text-sm">
                        {errors.semester.message as string}
                      </p>
                    )}
                  </div>
                </section>

                <small>
                  Note: Please ensure that you select or add the correct
                  institution. Incorrect data will make you ineligible for
                  associated drives.
                </small>
              </section>
            </section>
          </section>

          <div className="flex mt-8 w-full justify-center">
            <Button type="submit" className="uppercase">
              Proceed
            </Button>
          </div>
        </form>
      </section>
      <section className="hidden  md:flex transition-all duration-500 ease-in-out justify-end md:w-1/2">
        <Image
          src={"/assets/images/backgrounds/onboarding-bg.svg"}
          alt="decoration"
          style={{ filter: `brightness(${brightness}) opacity(${brightness})` }}
          width={800}
          height={800}
        />
      </section>
    </section>
  );
}
