"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Select, { components as RSComponents } from "react-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ui/imageUpload";
import { MultipleFilesUpload } from "@/components/ui/multipleFilesUpload";
import { RichTextEditor } from "@/components/ui/richTextEditor";
import KeyPointsSection from "@/components/ui/keyPoints";
import { validator } from "@/lib/validation";
import {
  DropdownOptions,
  semesterOptions,
} from "@/app/candidate/onboarding/page";
import { useFetch } from "@/components/hooks/useFetch";
import LoadingScreen from "@/components/layout/loader";
import { pastelColorOptions } from "../[activity_id]/edit/page";

export const activityTypeOptions = [
  { label: "Group discussion", value: "GD" },
  { label: "Interview", value: "interview" },
  { label: "Seminar", value: "seminar" },
  { label: "Course", value: "course" },
];

interface KeyPoint {
  id: string;
  text: string;
}

export default function ActivityCreatePage() {
  const router = useRouter();
  const { data, loading } = useFetch(`/api/admin/activities/create`);

  // ─── Form State ─────────────────────────────────────────────
  const [form, setForm] = useState({
    name: "",
    description: "",
    details: "",
    type: "",
    tag: "",
    internalName: "",
    bgColor: "",
    category: "",
    cgpa: "",
    basePrice: "",
    external_url: "",
  });

  const [keyPoints, setKeyPoints] = useState<KeyPoint[]>([]);
  const [allowedSem, setAllowedSem] = useState<any>(null);
  const [appliesTo, setAppliesTo] = useState<any[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [appliesToOptions, setAppliesToOptions] = useState<DropdownOptions[]>();
  const [departmentOptions, setDepartmentOptions] =
    useState<DropdownOptions[]>();
  const [departments, setDepartments] = useState<Array<any>>([]);
  const [error, setError] = useState<any[] | undefined>();
  // ─── Error Helper ───────────────────────────────────────────
  const getError = useCallback(
    (key: string) => error?.find((issue) => issue.path === key)?.message ?? "",
    [error]
  );

  const multiSelectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: "3rem",
      overflow: "visible",
    }),
    valueContainer: (base: any) => ({
      ...base,
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
      maxHeight: "4.5rem",
      overflowY: "auto",
      paddingRight: "8px",
    }),
    multiValue: (base: any) => ({
      ...base,
      whiteSpace: "normal",
      margin: "2px",
      maxWidth: "100%",
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      whiteSpace: "normal",
      overflow: "visible",
    }),
    indicatorsContainer: (base: any) => ({
      ...base,
      height: "100%",
    }),
    placeholder: (base: any) => ({ ...base, margin: 0 }),
  } as const;

  const customMultiComponents = {
    MultiValue: () => null,
  } as const;

  const renderSelectedBadges = (
    items: Array<any>,
    onRemove: (value: string) => void
  ) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((it: any) => (
          <button
            key={it.value}
            type="button"
            onClick={() => onRemove(it.value)}
            className="inline-flex items-center gap-2 bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded-md border border-gray-300 dark:border-slate-600 text-sm"
          >
            <span>{it.label}</span>
            <span className="text-xs">×</span>
          </button>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (!data?.appliesTo) return;

    setAppliesToOptions(data.appliesTo);
    if (data?.departments) setDepartmentOptions(data.departments);
  }, [data]);

  // ─── Submit Handler ─────────────────────────────────────────
  const handleSubmit = async () => {
    const payload = {
      ...form,
      keyPoints,
      allowedSem,
      appliesTo,
      departments,
      files,
      image,
    };

    const validated = validator.validate("activity.create.fe", payload);
    if (!validated.success) {
      setError(validated.error.issues);
      return;
    }

    try {
      setError(undefined);

      const res = await fetch(`/api/admin/activities`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Something went wrong");

      toast.success("Activity successfully created");
      router.push("/admin/activity");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to create activity");
    }
  };
  if (loading) return <LoadingScreen />;

  // ─── UI ─────────────────────────────────────────────────────
  return (
    <form className="min-h-[90vh] pt-32 px-4 md:px-6 lg:px-8 lg:pt-32 ">
      {/* Image Upload */}
      <div className="mb-4">
        <ImageUpload file={image} setFile={setImage} />
      </div>

      {/* Main Layout */}
      <section className="md:flex gap-12">
        {/* Left Section */}
        <section className="w-1/2">
          <Input
            className="font-bold text-3xl font-poppins-sans"
            placeholder="Activity Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <p className="text-red-500 text-sm">{getError("name")}</p>

          <Textarea
            className="max-w-[75ch] mt-2"
            rows={5}
            placeholder="Activity Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <p className="text-red-500 text-sm">{getError("description")}</p>

          <h3 className="font-bold font-poppins-sans text-lg mt-4">Details</h3>
          <RichTextEditor
            content={form.details}
            onChange={(val) => setForm({ ...form, details: val })}
          />
          <p className="text-red-500 text-sm">{getError("details")}</p>

          <section className="mt-4">
            <MultipleFilesUpload label="Activity files" onChange={setFiles} />
            <p className="text-red-500 text-sm">{getError("files")}</p>
          </section>
        </section>

        {/* Right Section */}
        <section className="w-1/2">
          <KeyPointsSection initialPoints={keyPoints} onChange={setKeyPoints} />
          <p className="text-red-500 text-sm">{getError("keyPoints")}</p>

          <section className="mt-6">
            <h2 className="font-bold text-lg mb-2">Requirements</h2>
            <Input
              type="number"
              placeholder="Minimum CGPA"
              value={form.cgpa}
              onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
            />
            <p className="text-red-500 text-sm">{getError("cgpa")}</p>

            <Select
              className="mt-2"
              classNames={{ control: () => "h-12" }}
              options={semesterOptions}
              value={allowedSem}
              placeholder="Select semester"
              onChange={(val) => setAllowedSem(val)}
            />
            <p className="text-red-500 text-sm">{getError("allowedSem")}</p>
            <div className="mt-4">
              <Label>Departments</Label>
              <Select
                className="mt-2"
                isMulti
                styles={multiSelectStyles}
                components={customMultiComponents}
                classNames={{ control: () => "h-12" }}
                options={departmentOptions}
                value={departments}
                placeholder="Select departments"
                onChange={(val) => setDepartments(val as any)}
              />
              <p className="text-red-500 text-sm">{getError("departments")}</p>
              {renderSelectedBadges(departments, (v) =>
                setDepartments((prev) => prev.filter((p) => p.value !== v))
              )}
            </div>
          </section>
        </section>
      </section>

      <hr className="my-5" />

      {/* Meta Info */}
      <section className="flex flex-wrap gap-4">
        {[
          { label: "Price", key: "basePrice", type: "number" },
          { label: "External Link", key: "external_url" },
          {
            label: "Type",
            key: "type",
            options: activityTypeOptions,
            isSelect: true,
          },
          {
            label: "Category",
            key: "category",
            options: [
              { label: "Independent", value: "Independent" },
              { label: "Part of Drive", value: "PartOfDrive" },
              { label: "Pre-requisite", value: "PreRequisite" },
            ],
            isSelect: true,
          },
          { label: "Tag", key: "tag" },
          { label: "Internal Name", key: "internalName" },
        ].map(({ label, key, type, isSelect, options }) => (
          <div key={key}>
            <Label>{label}</Label>
            {isSelect ? (
              <Select
                className="mt-2"
                classNames={{ control: () => "h-12" }}
                options={options}
                value={
                  options?.find((opt) => opt.value === (form as any)[key]) ||
                  null
                }
                placeholder={`Select ${label}`}
                onChange={(val) =>
                  setForm({ ...form, [key]: (val as any)?.value ?? "" })
                }
              />
            ) : (
              <Input
                className="mt-2"
                type={type ?? "text"}
                value={(form as any)[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            )}
            <p className="text-red-500 text-sm">{getError(key)}</p>
          </div>
        ))}

        <div>
          <Label>Applies To</Label>
          <Select
            className="mt-2"
            isMulti
            styles={multiSelectStyles}
            components={customMultiComponents}
            classNames={{ control: () => "h-12" }}
            options={appliesToOptions}
            value={appliesTo}
            placeholder="Select applies to"
            onChange={(val) => setAppliesTo(val as any)}
          />
          <p className="text-red-500 text-sm">{getError("appliesTo")}</p>
          {renderSelectedBadges(appliesTo, (v) =>
            setAppliesTo((prev) => prev.filter((p) => p.value !== v))
          )}
        </div>

        <div>
          <Label>Color</Label>
          <Select
            className="mt-2"
            classNames={{ control: () => "h-12" }}
            options={pastelColorOptions.map((opt: any) => ({
              ...opt,
              label: (
                <div className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded-full border"
                    style={{ backgroundColor: opt.value }}
                  />
                  <span>{opt.label}</span>
                </div>
              ),
            }))}
            value={
              pastelColorOptions.find(
                (opt: any) => opt.value === form.bgColor
              ) || null
            }
            placeholder="Select background color"
            onChange={(val) => setForm({ ...form, bgColor: val?.value ?? "" })}
          />
          <p className="text-red-500 text-sm">{getError("bgColor")}</p>
        </div>
      </section>

      <section className="flex justify-end w-full mt-8">
        <Button
          variant="link"
          type="button"
          onClick={() => router.push("/admin/activity")}
        >
          Cancel
        </Button>
        <Button type="button" onClick={handleSubmit}>
          Create
        </Button>
      </section>
    </form>
  );
}
