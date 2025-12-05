"use client";

import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  DropdownOptions,
  semesterOptions,
} from "@/app/candidate/onboarding/page";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type FEActivity = {
  id: string;
  name: string;
  status: "active" | "inactive";
  createdDate: Date;
  updatedDate: Date;
  basePrice: number;
};

export const addActivitySchema = z.object({
  basePrice: z
    .string() // input is string
    .refine((val) => !isNaN(Number(val)), {
      message: "Price must be a number",
    }) // check valid number
    .transform((val) => Number(val)) // convert to number
    .refine((num) => num >= 1, {
      message: "price must be greater than 1 ",
    }),
  cgpa: z
    .string() // input is string
    .refine((val) => !isNaN(Number(val)), { message: "CGPA must be a number" }) // check valid number
    .transform((val) => Number(val)) // convert to number
    .refine((num) => num >= 1 && num <= 10, {
      message: "CGPA must be between 1 and 10",
    })
    .optional(),
  activity: z
    .object({ value: z.string(), label: z.string() })
    .transform((obj) => obj.value),
  allowedSem: z
    .object({ value: z.number(), label: z.string() })
    .transform((obj) => obj.value),
});

export type FormDataAddActivityDetails = z.infer<typeof addActivitySchema>;

export const activityColumns = (
  activities: DropdownOptions[],
  refetch: () => Promise<void>
): ColumnDef<FEActivity>[] => {
  return [
    {
      accessorKey: "activity_id",
      header: "Name",
      enableColumnFilter: true,
      cell: (cell) => {
        const [open, setOpen] = React.useState(false);
        const [loading, setLoading] = React.useState(false);
        const activity = activities.find(
          (activity) => activity.value === cell.getValue()
        )?.label;

        const defaultActivityOption = activities.find(
          (opt) => opt.value === cell.getValue()
        );

        const {
          register: registerActivity,
          handleSubmit: handleSubmitActivity,
          control: controlActivity,
          reset: resetActivity,
          formState: { errors: errorsActivity },
        } = useForm<FormDataAddActivityDetails>({
          resolver: zodResolver(addActivitySchema) as any,
          defaultValues: {
            activity: defaultActivityOption ?? undefined,
            allowedSem: undefined,
          } as any,
        });

        const onSubmitActivity: SubmitHandler<
          FormDataAddActivityDetails
        > = async (data) => {
          try {
            const instActivityId = (cell.row.original as any)?.id;
            if (!instActivityId)
              throw new Error("institution_activity id missing");

            const payload = {
              action: "update",
              id: instActivityId,
              basePrice:
                data.basePrice !== undefined
                  ? Number(data.basePrice)
                  : undefined,
              allowedSem:
                data.allowedSem !== undefined
                  ? Number(data.allowedSem)
                  : undefined,
              cgpa: data.cgpa !== undefined ? Number(data.cgpa) : undefined,
            } as any;

            const res = await fetch(
              `/api/admin/institution/institution_activity`,
              {
                method: "POST",
                body: JSON.stringify(payload),
              }
            );

            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || "Failed to update");
            await refetch();

            toast.success("Activity updated");
            setOpen(false);
          } catch (err: any) {
            toast.error(err?.message || "Failed to update activity");
          }
        };

        React.useEffect(() => {
          const load = async () => {
            const instActivityId = (cell.row.original as any)?.id;
            if (!instActivityId) return;
            setLoading(true);
            try {
              const res = await fetch(
                `/api/admin/institution/institution_activity?id=${instActivityId}`
              );
              const json = await res.json();
              if (!res.ok) throw new Error(json?.message || "Failed to fetch");

              const inst = json.institutionActivity;
              resetActivity({
                activity:
                  activities.find((opt) => opt.value === cell.getValue()) ??
                  undefined,
                basePrice:
                  inst?.baseprice !== null && inst?.baseprice !== undefined
                    ? String(inst.baseprice)
                    : "",
                cgpa:
                  inst?.cgpa_greater_than !== null &&
                  inst?.cgpa_greater_than !== undefined
                    ? String(inst.cgpa_greater_than)
                    : undefined,
                allowedSem:
                  inst?.allowed_sem !== null && inst?.allowed_sem !== undefined
                    ? semesterOptions.find((s) => s.value === inst.allowed_sem)
                    : undefined,
              } as any);
            } catch (err) {
              console.error("Failed to load institution activity", err);
            } finally {
              setLoading(false);
            }
          };
          if (open) load();
        }, [open]);

        return (
          <Dialog open={open} onOpenChange={setOpen} modal>
            <DialogTrigger asChild>
              <Button
                className="p-0 h-fit text-sm underline font-bold"
                variant={"link"}
              >
                {activity}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Update {activity}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmitActivity(onSubmitActivity)}>
                <section className="grid gap-2">
                  {/* Drive Name */}
                  <Controller
                    name="activity"
                    control={controlActivity}
                    render={({ field }) => (
                      <div>
                        <Label> Activity name *</Label>
                        <Select
                          {...field}
                          className="mt-2"
                          classNames={{ control: () => "h-12" }}
                          options={activities as any}
                          placeholder="Select Activity"
                          // field.value is the option object (or undefined)
                          value={
                            (field.value as any) ??
                            activities.find(
                              (opt) => opt.value === cell.getValue()
                            ) ??
                            null
                          }
                          onChange={(val: any) => field.onChange(val)}
                          isDisabled={true}
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
                  <Button type="submit">Update Activity</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (cell) => {
        return <Switch checked={cell.getValue() === "active" ? true : false} />;
      },
    },
    {
      accessorKey: "baseprice",
      header: "Base Price",
    },
    {
      accessorKey: "updated_date",
      header: "Last Updated Date",
      cell: (cell) => (cell.getValue() as Date).toLocaleString(),
    },
  ];
};
