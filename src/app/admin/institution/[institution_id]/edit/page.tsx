"use client";

import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { useFetch } from "@/components/hooks/useFetch";
import LoadingScreen from "@/components/layout/loader";

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
export default function InstitutionEditPage() {
  const router = useRouter();
  const params = useParams();

  const id = params["institution_id"];

  const { data, loading } = useFetch(`/api/admin/institution/${id}`);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InstitutionData>({
    resolver: zodResolver(formSchema) as any,
    values: {
      name: data?.institution?.name || "",
      city: data?.institution?.city || "",
      state: data?.institution?.state || "",
      phone: data?.institution?.contact_phone_details || "",
      contactPerson: data?.institution?.contact_person || "",
    },
  });

  const onSubmit: SubmitHandler<InstitutionData> = async (data) => {
    // Submit updated institution details to backend
    if (!id) return;

    try {
      const req = await fetch(`/api/admin/institution/${id}`, {
        method: "POST",
        body: JSON.stringify({
          upsert_data: {
            contact_person: data.contactPerson,
            contact_phone_details: data.phone,
            city: data.city,
            state: data.state,
            name: data.name,
          },
          action: "editInstitution",
        }),
      });

      const res = await req.json().catch(() => ({}));

      if (req.status !== 200) {
        toast.error(res.message ?? "Failed to update institution");
        return;
      }

      toast.success("Institution updated");
      router.push(`/admin/institution/${id}`);
    } catch (err) {
      console.error("Failed to update institution:", err);
      toast.error("Failed to update institution");
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <section className="min-h-[90vh] pt-32 px-4 md:px-6 lg:px-8 lg:pt-32 ">
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
            onClick={() => router.push(`/admin/institution/${id}`)}
          >
            cancel
          </Button>

          <Button className="uppercase" type="submit">
            Update
          </Button>
        </div>
      </form>
    </section>
  );
}
