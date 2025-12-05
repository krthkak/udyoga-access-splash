"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileInput } from "@/components/ui/fileInput";
import { useRouter } from "next/navigation";
import { useFetch } from "@/components/hooks/useFetch";
import LoadingScreen from "@/components/layout/loader";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { DropdownOptions, semesterOptions } from "../onboarding/page";

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

  bio: z.string().optional(),
  cgpa: z
    .string() // input is string
    .refine((val) => !isNaN(Number(val)), { message: "CGPA must be a number" }) // check valid number
    .transform((val) => Number(val)) // convert to number
    .refine((num) => num >= 1 && num <= 10, {
      message: "CGPA must be between 1 and 10",
    })
    .optional(),

  resume: z.any().optional(),

  additionalDocuments: z.any().optional(),
});

type FormDataOnboarding = z.infer<typeof formSchema>;

export default function ProfilePage() {
  const { update, status } = useSession();
  const router = useRouter();

  const { data, loading } = useFetch<{
    user: FormDataOnboarding;
    departments: DropdownOptions[];
    institutions: DropdownOptions[];
  }>("/api/candidate/profile");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormDataOnboarding>({
    resolver: zodResolver(formSchema) as any,
    values: data?.user ? { ...data?.user } : undefined,
  });

  const onSubmit: SubmitHandler<FormDataOnboarding> = async (data) => {
    const req = await fetch("/api/candidate/profile", {
      method: "PUT",
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

    toast.success("Profile successfully updated!");
    router.push("/candidate/");
  };

  if (loading || status === "loading") {
    return <LoadingScreen />;
  }

  return (
    <section className="min-h-[90vh] pt-32 px-4 md:pt-0 md:px-6 lg:px-8 md:mt-6 lg:pt-0 ">
      <h2 className="text-4xl mb-8 font-bold">My Details</h2>
      <form onSubmit={handleSubmit(onSubmit as any)} className="mt-2">
        {/* PERSONAL DETAILS */}
        <section className="lg:flex gap-8">
          <section className="lg:w-1/2 bg-white rounded-lg shadow-lg p-8 mb-6">
            <h3 className="text-xl font-poppins-sans font-bold">
              Personal Details
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
                  <Input type="number" className="mt-2" {...register("age")} />
                  {errors.age && (
                    <p className="text-red-500 text-sm">{errors.age.message}</p>
                  )}
                </div>

                <div className="lg:w-1/2">
                  <Label>Gender *</Label>
                  <div className="flex gap-4 mt-2 h-12 items-center">
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
          <section className="lg:w-1/2 bg-white rounded-lg shadow-lg p-8 mb-6">
            <h3 className="text-xl font-poppins-sans font-bold">
              College Details
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
                        options={data?.institutions ?? []}
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
                        options={data?.departments ?? []}
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

        <section className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h3 className="text-xl font-poppins-sans font-bold">
            Additional Details
          </h3>
          <section className="grid gap-4 p-2">
            <section className="md:flex w-full gap-6 ">
              <div className="w-full">
                <Label>Bio</Label>
                <Textarea className="mt-2" {...register("bio")} rows={5} />
                {errors.bio && (
                  <p className="text-red-500 text-sm">
                    {errors.bio.message as string}
                  </p>
                )}
              </div>
            </section>

            <section className="md:flex w-full gap-6">
              <div>
                <Label>CGPA</Label>
                <Input type="number" className="mt-2" {...register("cgpa")} />
                {errors.cgpa && (
                  <p className="text-red-500 text-sm">
                    {errors.cgpa.message as string}
                  </p>
                )}
              </div>

              <Controller
                name="resume"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Resume</Label>
                    <FileInput
                      value={field.value}
                      onChange={(file) => field.onChange(file)}
                      accept=".pdf,.doc,.docx"
                    />
                    {errors.resume && (
                      <p className="text-red-500 text-sm">
                        {errors.resume.message as string}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="additionalDocuments"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Additional Documents</Label>
                    <FileInput
                      value={field.value}
                      onChange={(file) => field.onChange(file)}
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg"
                    />
                    {errors.additionalDocuments && (
                      <p className="text-red-500 text-sm">
                        {errors.additionalDocuments.message as string}
                      </p>
                    )}
                  </div>
                )}
              />
            </section>
          </section>
        </section>

        <div className="flex mt-8 w-full justify-end">
          <Button
            type="button"
            variant={"link"}
            className="uppercase"
            onClick={() => router.push("/candidate")}
          >
            Cancel
          </Button>
          <Button type="submit" className="uppercase">
            Update
          </Button>
        </div>
      </form>
    </section>
  );
}
