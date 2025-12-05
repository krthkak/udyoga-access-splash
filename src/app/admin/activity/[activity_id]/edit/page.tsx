"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ui/imageUpload";
import { MultipleFilesUpload } from "@/components/ui/multipleFilesUpload";
import LoadingScreen from "@/components/layout/loader";
import { RichTextEditor } from "@/components/ui/richTextEditor";
import { useFetch } from "@/components/hooks/useFetch";
import { validator } from "@/lib/validation";
import {
  DropdownOptions,
  semesterOptions,
} from "@/app/candidate/onboarding/page";
import KeyPointsSection from "@/components/ui/keyPoints";
import { activityTypeOptions } from "../../create/page";

export const pastelColorOptions: any[] = [
  { label: "Pastel Green", value: "#E2F6CD" },
  { label: "Soft Blush Pink", value: "#FADADD" },
  { label: "Baby Blue", value: "#D6EAF8" },
  { label: "Lavender Mist", value: "#E8DAEF" },
  { label: "Pale Peach", value: "#FFE6CC" },
  { label: "Minty Aqua", value: "#CCF0F3" },
];

interface ActivityEditPageProps {
  params: Promise<{ activity_id: string }>;
}

interface KeyPoint {
  id: string;
  text: string;
}

interface SemesterOptions {
  label: string;
  value: number;
}

export default function ActivityEditPage({ params }: ActivityEditPageProps) {
  const router = useRouter();
  const { activity_id } = React.use(params);
  const { data, loading } = useFetch(`/api/admin/activities/${activity_id}`);

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
  const [allowedSem, setAllowedSem] = useState<SemesterOptions | null>(null);
  const [appliesTo, setAppliesTo] = useState<Array<any>>([]);
  const [appliesToOptions, setAppliesToOptions] = useState<DropdownOptions[]>();
  const [departmentOptions, setDepartmentOptions] =
    useState<DropdownOptions[]>();
  const [departments, setDepartments] = useState<Array<any>>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<any[] | undefined>();

  // ─── Derived Error Helper ───────────────────────────────────
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

  // ─── Fetch Prefill ──────────────────────────────────────────
  useEffect(() => {
    if (!data?.activity || !data?.appliesTo) return;

    const a = data.activity;
    setForm({
      name: a.name ?? "",
      description: a.description ?? "",
      details: a.details ?? "",
      type: a.type ?? "",
      tag: a.tag ?? "",
      internalName: a.internal_name ?? "",
      bgColor: a.bg_color ?? "",
      category: a.category ?? "",
      cgpa: a.cgpa_greater_than?.toString() ?? "",
      basePrice: a.baseprice?.toString() ?? "",
      external_url: a.external_url ?? "",
    });

    setKeyPoints(
      (a.keypoints ?? []).map((key: string) => ({
        id: crypto.randomUUID(),
        text: key,
      }))
    );

    if (a.allowed_sem) {
      setAllowedSem({
        label: a.allowed_sem.toString(),
        value: a.allowed_sem,
      });
    }

    setAppliesToOptions(data.appliesTo);
    setAppliesTo(
      data.appliesTo.filter((opt: any) => a.applies.includes(opt.value))
    );
    if (data?.departments) setDepartmentOptions(data.departments);
    if (data.departments && a.departments) {
      const selected = data.departments.filter((opt: any) =>
        (a.departments || []).some((dep: any) =>
          dep?.id ? dep.id === opt.value : dep === opt.value
        )
      );
      setDepartments(selected);
    }
  }, [data]);

  // ─── Submit Handler ─────────────────────────────────────────
  const handleSubmit = async () => {
    const payload = {
      ...form,
      keyPoints,
      cgpa: form.cgpa,
      allowedSem,
      files,
      image,
      basePrice: form.basePrice,
      appliesTo,
      departments,
    };

    const validated = validator.validate("activity.create.fe", payload);
    if (!validated.success) {
      setError(validated.error.issues);
      return;
    }

    try {
      setError(undefined);
      const res = await fetch(`/api/admin/activities/${activity_id}`, {
        method: "POST",
        body: JSON.stringify({ ...payload, id: activity_id }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Something went wrong");

      toast.success("Activity successfully updated");
      router.push("/admin/activity");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to update activity");
    }
  };

  // ─── Early Return ───────────────────────────────────────────
  if (loading) return <LoadingScreen />;

  // ─── UI ─────────────────────────────────────────────────────
  return (
    <form className="min-h-[90vh] pt-32 px-4 md:px-6 lg:px-8">
      {/* Image Upload */}
      <div className="mb-4">
        <ImageUpload file={image} setFile={setImage} />
      </div>

      {/* Main Layout */}
      <section className="md:flex gap-12">
        {/* Left Section */}
        <div className="w-1/2">
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

          <h3 className="font-bold text-lg mt-4">Details</h3>
          <RichTextEditor
            content={form.details}
            onChange={(val) => setForm({ ...form, details: val })}
          />
          <p className="text-red-500 text-sm">{getError("editorState")}</p>

          <div className="mt-4">
            <MultipleFilesUpload label="Activity files" onChange={setFiles} />
            <p className="text-red-500 text-sm">{getError("files")}</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/2">
          <KeyPointsSection initialPoints={keyPoints} onChange={setKeyPoints} />

          <p className="text-red-500 text-sm">{getError("keyPoints")}</p>

          <div className="mt-6">
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
              onChange={(val) => setAllowedSem(val as any)}
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
          </div>
        </div>
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
            isSelect: true,
            options: activityTypeOptions,
          },
          {
            label: "Category",
            key: "category",
            isSelect: true,
            options: [
              { label: "Independent", value: "Independent" },
              { label: "Part of Drive", value: "PartOfDrive" },
            ],
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
            options={pastelColorOptions.map((opt) => ({
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
              pastelColorOptions.find((opt) => opt.value === form.bgColor) ||
              null
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
          Update
        </Button>
      </section>
    </form>
  );
}
