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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { ColumnDef } from "@tanstack/react-table";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import z from "zod";
import {
  DropdownOptions,
  semesterOptions,
} from "@/app/candidate/onboarding/page";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type FEDrive = {
  id: string;
  name: string;
  status: "active" | "inactive";
  createdDate: Date;
  updatedDate: Date;
  basePrice: number;
};

export const addDriveSchema = z.object({
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
  drive: z
    .string() // input is string
    .refine((val) => val.length > 0, {
      message: "Drive should at least be selected",
    }),
  allowedSem: z
    .string() // input is string
    .refine((val) => !isNaN(Number(val)), {
      message: "allowedSem must be a number",
    }) // check valid number
    .transform((val) => Number(val)) // convert to number
    .refine((num) => num >= 1 && num <= 10, {
      message: "allowedSem must be between 1 and 8",
    }),
});

export type FormDataAddDriveDetails = z.infer<typeof addDriveSchema>;

export const driveColumns = (
  drives: DropdownOptions[],
  refetch: () => Promise<void>
): ColumnDef<FEDrive>[] => {
  return [
    {
      accessorKey: "drive_id",
      header: "Name",
      cell: (cell) => {
        const [open, setOpen] = React.useState(false);
        const [loading, setLoading] = React.useState(false);
        const {
          register: registerDrive,
          handleSubmit: handleSubmitDrive,
          control: controlDrive,
          reset: resetDrive,
          formState: { errors: errorsDrive },
        } = useForm<FormDataAddDriveDetails>({
          resolver: zodResolver(addDriveSchema) as any,
          defaultValues: {
            drive: String(cell.getValue() ?? ""),
            allowedSem: undefined,
          },
        });

        const drive = drives.find(
          (drive) => drive.value === cell.getValue()
        )?.label;

        const onSubmitDrive: SubmitHandler<FormDataAddDriveDetails> = async (
          data
        ) => {
          // Submit update to institution_drive route
          try {
            const instDriveId = (cell.row.original as any)?.id;
            if (!instDriveId) throw new Error("institution_drive id missing");

            const payload = {
              action: "update",
              id: instDriveId,
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
              `/api/admin/institution/institution_drive`,
              {
                method: "POST",
                body: JSON.stringify(payload),
              }
            );

            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || "Failed to update");
            await refetch();
            toast.success("Drive updated");
            setOpen(false);
            // optionally refresh page or table; consumer can refetch externally
          } catch (err: any) {
            toast.error(err?.message || "Failed to update drive");
          }
        };

        React.useEffect(() => {
          // when dialog opens, fetch institution_drive details and reset form
          const load = async () => {
            const instDriveId = (cell.row.original as any)?.id;
            if (!instDriveId) return;
            setLoading(true);
            try {
              const res = await fetch(
                `/api/admin/institution/institution_drive?id=${instDriveId}`
              );
              const json = await res.json();
              if (!res.ok) throw new Error(json?.message || "Failed to fetch");

              const inst = json.institutionDrive;
              resetDrive({
                drive: String(cell.getValue() ?? ""),
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
                    ? String(inst.allowed_sem)
                    : undefined,
              } as any);
            } catch (err) {
              console.error("Failed to load institution drive", err);
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
                {drive}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Update {drive}</DialogTitle>
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
                        {/* show drive as a dropdown and keep the RHF field as the drive id (string) */}
                        <Select
                          {...field}
                          className="mt-2"
                          classNames={{ control: () => "h-12" }}
                          options={drives as any}
                          placeholder="Select drive"
                          value={
                            drives?.find(
                              (opt) => String(opt.value) === String(field.value)
                            ) ?? null
                          }
                          onChange={(opt: any) =>
                            field.onChange(String(opt?.value))
                          }
                          isDisabled={true}
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
                  <Button type="submit">Update Drive</Button>
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
