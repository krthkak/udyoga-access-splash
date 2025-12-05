"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileInput } from "@/components/ui/fileInput";
import { Label } from "@/components/ui/label";
import RevenueCard from "@/components/ui/revenueCard";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import {
  FormDataAddDriveDetails,
  addDriveSchema,
  driveColumns,
} from "./drive-columns";
import {
  FormDataAddActivityDetails,
  activityColumns,
  addActivitySchema,
} from "./activity-columns";
import { useFetch } from "@/components/hooks/useFetch";
import LoadingScreen from "@/components/layout/loader";
import {
  DropdownOptions,
  semesterOptions,
} from "@/app/candidate/onboarding/page";
import { toast } from "sonner";

const formSchema = z.object({
  studentFile: z
    .any()
    .refine(
      (file) =>
        file instanceof File || (file instanceof FileList && file.length > 0),
      "File is required"
    ),
});

type FormDataStudentDetails = z.infer<typeof formSchema>;

export default function InstitutionPage() {
  const params = useParams();

  const id = params["institution_id"];
  const { data, loading, refetch } = useFetch(`/api/admin/institution/${id}`);

  const [activityOptions, setActivityOptions] = useState<DropdownOptions[]>();
  const [driveOptions, setDriveOptions] = useState<DropdownOptions[]>();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormDataStudentDetails>({
    resolver: zodResolver(formSchema) as any,
  });

  const {
    register: registerDrive,
    handleSubmit: handleSubmitDrive,
    control: controlDrive,
    formState: { errors: errorsDrive },
  } = useForm<FormDataAddDriveDetails>({
    resolver: zodResolver(addDriveSchema) as any,
  });
  const {
    register: registerActivity,
    handleSubmit: handleSubmitActivity,
    control: controlActivity,
    formState: { errors: errorsActivity },
  } = useForm<FormDataAddActivityDetails>({
    resolver: zodResolver(addActivitySchema) as any,
  });

  const onSubmit: SubmitHandler<FormDataStudentDetails> = (data) => {
    // You can handle uploads with FormData here if needed.
  };

  const onSubmitDrive: SubmitHandler<FormDataAddDriveDetails> = async (
    data
  ) => {
    try {
      const req = await fetch(`/api/admin/institution/${id}`, {
        method: "POST",
        body: JSON.stringify({
          ...data,
          driveId: data.drive,
          drive: undefined,
          action: "addDrive",
        }),
      });

      const res = await req.json();

      if (req.status !== 200) {
        toast.error(res.message ?? "Something went wrong!");
        return;
      }

      toast.success("Drive added successfully!");
      await refetch();
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  const onSubmitActivity: SubmitHandler<FormDataAddActivityDetails> = async (
    data
  ) => {
    try {
      const req = await fetch(`/api/admin/institution/${id}`, {
        method: "POST",
        body: JSON.stringify({
          ...data,
          activityId: data.activity,
          activity: undefined,
          action: "addActivity",
        }),
      });

      const res = await req.json();

      if (req.status !== 200) {
        toast.error(res.message ?? "Something went wrong!");
        return;
      }

      toast.success("Activity added successfully!");
      await refetch();
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    if (!data?.drives || !data?.activities) return;
    setActivityOptions(data.activities);
    setDriveOptions(data.drives);
  }, [data]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <section className="min-h-[90vh] pt-32 px-4 md:px-6 lg:px-8 lg:pt-32 ">
      <section className="flex flex-wrap justify-between mb-4">
        <h2 className="font-bold font-poppins-sans text-2xl">
          {data?.institution?.name}
        </h2>
        <div className="flex gap-2">
          <Link href={`/admin/institution/${id}/edit`}>
            <Button variant={"link"} className="uppercase">
              edit institution details
            </Button>
          </Link>
          <Dialog modal>
            <DialogTrigger asChild>
              <Button className="uppercase">upload student details</Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Upload Student details</DialogTitle>
                <DialogDescription>
                  To verify the students who sign up to our registered
                  institution. We want the data of the students this is a
                  mandatory step of the workflow to work efficiently.
                </DialogDescription>
              </DialogHeader>
              <small>
                To understand the format of the excel sheet. Please click on
                this{" "}
                <Link
                  className="text-udyoga-blue underline"
                  href={"/#"}
                  download={"excel"}
                >
                  link
                </Link>
                .
              </small>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="studentFile"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Label> Upload Excel Sheet</Label>
                      <FileInput {...field}></FileInput>
                      {errors.studentFile && (
                        <p className="text-red-500 text-sm">
                          {errors.studentFile.message as string}
                        </p>
                      )}
                    </div>
                  )}
                />
                <div className="flex justify-end mt-2">
                  <Button type="submit">Upload</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>
      <section className="flex gap-3">
        <RevenueCard text="Revenue" value={32323322}></RevenueCard>
        <RevenueCard text="Revenue" value={32323322}></RevenueCard>
        <RevenueCard text="Revenue" value={32323322}></RevenueCard>
      </section>
      <section className="flex flex-wrap justify-between py-8 items-center">
        <h2 className="font-bold font-poppins-sans text-2xl">Drives</h2>
        <div className="flex gap-2">
          <Dialog modal>
            <DialogTrigger asChild>
              <Button className="uppercase">Add Drive</Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Add Drive</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmitDrive(onSubmitDrive)}>
                <section className="grid gap-2">
                  {/* Drive Name */}
                  <Controller
                    name="drive"
                    control={controlDrive}
                    render={({ field }) => (
                      <div>
                        <Label> Drive name *</Label>
                        <Select
                          {...field}
                          className="mt-2"
                          classNames={{ control: () => "h-12" }}
                          options={driveOptions as any}
                          placeholder="Select drive"
                          value={
                            driveOptions?.find(
                              (opt) => String(opt.value) === String(field.value)
                            ) ?? null
                          }
                          onChange={(opt: any) =>
                            field.onChange(String(opt?.value))
                          }
                        />
                        {errorsDrive.drive && (
                          <p className="text-red-500 text-sm">
                            {errorsDrive.drive.message as string}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  {/* Price */}
                  <div>
                    <Label> Price for the drive *</Label>
                    <Input
                      className="mt-2"
                      {...registerDrive("basePrice")}
                      type="number"
                    />
                    {errorsDrive.basePrice && (
                      <p className="text-red-500 text-sm">
                        {errorsDrive.basePrice.message as string}
                      </p>
                    )}
                  </div>

                  {/* Minimum CGPA */}
                  <div>
                    <Label> Minimum CGPA *</Label>
                    <Input
                      className="mt-2"
                      {...registerDrive("cgpa")}
                      type="number"
                    />
                    {errorsDrive.cgpa && (
                      <p className="text-red-500 text-sm">
                        {errorsDrive.cgpa.message as string}
                      </p>
                    )}
                  </div>

                  {/* Allowed Semester */}
                  <Controller
                    name="allowedSem"
                    control={controlDrive}
                    render={({ field }) => (
                      <div>
                        <Label> Allowed Semester *</Label>
                        <Select
                          {...field}
                          className="mt-2"
                          classNames={{ control: () => "h-12" }}
                          options={semesterOptions as any}
                          placeholder="Select semester"
                          // single-select: map option -> value for react-hook-form
                          value={
                            semesterOptions?.find(
                              (opt) => String(opt.value) === String(field.value)
                            ) ?? null
                          }
                          onChange={(opt: any) =>
                            field.onChange(String(opt?.value))
                          }
                        />
                        {errorsDrive.allowedSem && (
                          <p className="text-red-500 text-sm">
                            {errorsDrive.allowedSem.message as string}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </section>

                <div className="flex justify-end mt-2">
                  <Button type="submit">Add Drive</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>
      <section className="flex flex-wrap ">
        <section className="grid grid-cols-2 gap-3 w-1/2 pr-5">
          <RevenueCard text="Revenue" value={32323322}></RevenueCard>
          <RevenueCard text="Revenue" value={32323322}></RevenueCard>
          <RevenueCard text="Revenue" value={32323322}></RevenueCard>
        </section>
        <section className="w-1/2">
          <DataTable
            columns={driveColumns(driveOptions ?? [], refetch)}
            data={data?.institution?.institution_drives}
          />
        </section>
      </section>
      <section className="flex flex-wrap justify-between py-8 items-center ">
        <h2 className="font-bold font-poppins-sans text-2xl">Activities</h2>
        <div className="flex gap-2">
          <Dialog modal>
            <DialogTrigger asChild>
              <Button className="uppercase">Add Activity</Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Add Activity</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmitActivity(onSubmitActivity)}>
                <section className="grid gap-2">
                  {/* Activity Name */}
                  <Controller
                    name="activity"
                    control={controlActivity}
                    render={({ field }) => (
                      <div>
                        <Label> Activity name *</Label>
                        <Select
                          {...field}
                          options={activityOptions}
                          placeholder="Select Activity"
                          value={field.value ?? null} // field.value is already the object
                          onChange={(opt: any) => field.onChange(opt)}
                        />
                        {errorsActivity.activity && (
                          <p className="text-red-500 text-sm">
                            {errorsActivity.activity.message as string}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  {/* Price */}
                  <div>
                    <Label> Price for the activity *</Label>
                    <Input
                      className="mt-2"
                      {...registerActivity("basePrice")}
                      type="number"
                    />
                    {errorsActivity.basePrice && (
                      <p className="text-red-500 text-sm">
                        {errorsActivity.basePrice.message as string}
                      </p>
                    )}
                  </div>

                  {/* Minimum CGPA */}
                  <div>
                    <Label> Minimum CGPA *</Label>
                    <Input
                      className="mt-2"
                      {...registerActivity("cgpa")}
                      type="number"
                    />
                    {errorsActivity.cgpa && (
                      <p className="text-red-500 text-sm">
                        {errorsActivity.cgpa.message as string}
                      </p>
                    )}
                  </div>

                  {/* Allowed Semester */}
                  <Controller
                    name="allowedSem"
                    control={controlActivity}
                    render={({ field }) => (
                      <div>
                        <Label> Allowed Semester *</Label>
                        <Select
                          {...field}
                          className="mt-2"
                          classNames={{ control: () => "h-12" }}
                          options={semesterOptions as any}
                          placeholder="Select semester"
                          // single-select: provide the option object expected by the zod schema
                          value={(field.value as any) ?? null}
                          onChange={(opt: any) => field.onChange(opt)}
                        />
                        {errorsActivity.allowedSem && (
                          <p className="text-red-500 text-sm">
                            {errorsActivity.allowedSem.message as string}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </section>

                <div className="flex justify-end mt-2">
                  <Button type="submit">Add Activity</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>
      <section className="flex flex-wrap mb-32">
        <section className="grid grid-cols-2 gap-3 w-1/2 pr-5">
          <RevenueCard text="Revenue" value={32323322}></RevenueCard>
          <RevenueCard text="Revenue" value={32323322}></RevenueCard>
          <RevenueCard text="Revenue" value={32323322}></RevenueCard>
        </section>
        <section className="w-1/2">
          <DataTable
            columns={activityColumns(activityOptions ?? [], refetch)}
            data={data?.institution?.institution_activities}
          />
        </section>
      </section>
    </section>
  );
}
