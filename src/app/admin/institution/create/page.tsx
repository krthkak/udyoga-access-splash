"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Institution name is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  phone: z
    .string()
    .trim()
    .transform((val) => val.replace(/[\s-()]/g, ""))
    .transform((val) => val.replace(/^(\+?91|0)/, ""))
    .refine((val) => /^[6-9]\d{9}$/.test(val), {
      message: "Invalid Indian phone number",
    }),
  contactPerson: z.string().min(1, "Contact Person is required"),
});

type InstitutionData = z.infer<typeof formSchema>;

export default function InstitutionPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InstitutionData>({
    resolver: zodResolver(formSchema) as any,
  });

  const onSubmit: SubmitHandler<InstitutionData> = async (data) => {
    try {
      const req = await fetch("/api/admin/institution", {
        body: JSON.stringify(data),
        method: "POST",
      });
      const res = await req.json();

      if (req.status !== 200) {
        toast.error(res.message ?? "something went wrong");
        return;
      }
      if (!res) {
        toast.error(res.message ?? "Something went wrong!");
        return;
      }

      toast.success("Institution created successfully!");
      router.push("/admin/institution/");
    } catch (err) {
      toast.error((err as any)?.message ?? "something went wrong");
    }
  };

  return (
    <section className="min-h-[90vh] pt-32 px-4 md:px-6 lg:px-8 lg:pt-32">
      <h2 className="font-bold text-xl mb-4"> Institution Details</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="grid lg:grid-cols-3  gap-2">
          <div>
            <Label>Institution Name *</Label>
            <Input
              className="mt-2"
              {...register("name")}
              onChange={(e) => {
                register("name").onChange(e);
              }}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label>City *</Label>
            <Input
              className="mt-2"
              {...register("city")}
              onChange={(e) => {
                register("city").onChange(e);
              }}
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city.message}</p>
            )}
          </div>
          <div>
            <Label>State *</Label>
            <Input
              className="mt-2"
              {...register("state")}
              onChange={(e) => {
                register("state").onChange(e);
              }}
            />
            {errors.state && (
              <p className="text-red-500 text-sm">{errors.state.message}</p>
            )}
          </div>
          <div>
            <Label>Contact Person *</Label>
            <Input
              className="mt-2"
              {...register("contactPerson")}
              onChange={(e) => {
                register("contactPerson").onChange(e);
              }}
            />
            {errors.contactPerson && (
              <p className="text-red-500 text-sm">
                {errors.contactPerson.message}
              </p>
            )}
          </div>
          <div>
            <Label>Contact Person Phone *</Label>
            <Input
              className="mt-2"
              {...register("phone")}
              onChange={(e) => {
                register("phone").onChange(e);
              }}
              type="tel"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
        </section>
        <div className="flex justify-end mt-6">
          <Button
            className="uppercase"
            variant={"link"}
            type="button"
            onClick={() => router.push("/admin/institution")}
          >
            cancel
          </Button>

          <Button className="uppercase" type="submit">
            create
          </Button>
        </div>
      </form>
    </section>
  );
}
