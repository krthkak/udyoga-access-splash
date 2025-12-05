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
import KeyPointsSection from "@/components/ui/keyPoints";
import { pastelColorOptions } from "@/app/admin/activity/[activity_id]/edit/page";

interface DriveEditPageProps {
  params: Promise<{ drive_id: string }>;
}

interface KeyPoint {
  id: string;
  text: string;
}

export default function DriveEditPage({ params }: DriveEditPageProps) {
  const router = useRouter();
  const { drive_id } = React.use(params);
  const { data, loading } = useFetch(`/api/admin/drives/${drive_id}`);

  // ─── Form State ─────────────────────────────────────────────
  const [form, setForm] = useState({
    name: "",
    description: "",
    requirements: "",
    tag: "",
    availablePositions: "",
    cgpa: "",
    basePrice: "",
    bgColor: "",
    companyName: "",
  });

  const [keyPoints, setKeyPoints] = useState<KeyPoint[]>([]);
  const [allowedSem, setAllowedSem] = useState<any>(null);
  const [appliesTo, setAppliesTo] = useState<Array<any>>([]);
  const [appliesToOptions, setAppliesToOptions] = useState<Array<any>>([]);
  const [departmentOptions, setDepartmentOptions] = useState<Array<any>>([]);
  const [departments, setDepartments] = useState<Array<any>>([]);
  const [preRequisites, setPreRequisites] = useState<Array<any>>([]);
  const [preRequisiteOptions, setPreRequisiteOptions] = useState<Array<any>>(
    []
  );
  const [stages, setStages] = useState<Array<any>>([]);
  const [stageOptions, setStageOptions] = useState<Array<any>>([]);

  const [files, setFiles] = useState<File[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<any[] | undefined>();

  // ─── Derived Error Helper ───────────────────────────────────
  const getError = useCallback(
    (key: string) =>
      error?.find((issue) => {
        const path0 = Array.isArray(issue.path)
          ? String(issue.path[0])
          : String(issue.path);
        return path0 === key;
      })?.message ?? "",
    [error]
  );

  // react-select multi styles and custom components (hide inline chips)
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
    if (!data?.drive || !data?.appliesTo || !data.preRequisites || !data.stages)
      return;

    const d = data.drive;

    setForm({
      name: d.name ?? "",
      description: d.company_details ?? "",
      requirements: d.requirements ?? "",
      availablePositions: d.available_positions?.toString() ?? "",
      cgpa: d.cgpa_greater_than?.toString() ?? "",
      basePrice: d.baseprice?.toString() ?? "",
      tag: d.tag?.toString() ?? "",
      bgColor: d.bg_color?.toString() ?? "",
      companyName: d.company_name ?? "",
    });

    setKeyPoints(
      (d.keypoints ?? []).map((kp: string) => ({
        id: crypto.randomUUID(),
        text: kp,
      }))
    );

    if (d.allowed_sem)
      setAllowedSem({ label: d.allowed_sem.toString(), value: d.allowed_sem });

    setAppliesToOptions(data.appliesTo);
    setAppliesTo(
      data.appliesTo.filter((opt: any) => d.applies.includes(opt.value))
    );

    setPreRequisiteOptions(data.preRequisites);
    setPreRequisites(
      data.preRequisites.filter((opt: any) =>
        d.pre_requisites.includes(opt.value)
      )
    );

    setStages(
      data.stages
        .filter((opt: any) => d.stages.includes(opt.value))
        .map((stage: any) => ({ id: crypto.randomUUID(), stage: stage }))
    );

    if (data?.departments) setDepartmentOptions(data.departments);
    // drive.departments might be array of ids or objects
    if (data.departments && d.departments) {
      const selected = data.departments.filter((opt: any) =>
        (d.departments || []).some((dep: any) =>
          dep?.id ? dep.id === opt.value : dep === opt.value
        )
      );
      setDepartments(selected);
    }

    setStageOptions(data.stages);
  }, [data]);

  // ─── Submit Handler ─────────────────────────────────────────
  const handleSubmit = async () => {
    const payload = {
      ...form,
      availablePositions: form.availablePositions
        ? Number(form.availablePositions)
        : null,
      cgpa: form.cgpa ? Number(form.cgpa) : null,
      basePrice: form.basePrice ? Number(form.basePrice) : null,
      keyPoints: keyPoints.map((kp) => kp.text),
      allowedSem: allowedSem?.value ? Number(allowedSem?.value) : null,
      files,
      image,
      appliesTo: appliesTo
        .map((a) => (a?.value != null ? String(a.value).trim() : a?.value))
        .filter(Boolean),
      preRequisites: preRequisites
        .map((p) => (p?.value != null ? String(p.value).trim() : p?.value))
        .filter(Boolean),
      stages: stages
        .map((s) => {
          const v = s.stage ? s.stage.value ?? s.stage : undefined;
          return v != null && typeof v === "string" ? v.trim() : v;
        })
        .filter(Boolean),
      departments: departments
        .map((dpt) =>
          dpt?.value != null ? String(dpt.value).trim() : dpt?.value
        )
        .filter(Boolean),
    };

    const validated = validator.validate("drive.create.fe", payload);

    if (!validated.success) {
      setError(validated.error.issues);
      const first = validated.error.issues?.[0];
      if (first) toast.error(`Validation: ${first.message}`);
      return;
    }

    try {
      setError(undefined);
      const res = await fetch(`/api/admin/drives/${drive_id}`, {
        method: "POST",
        body: JSON.stringify({ ...payload, id: drive_id }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Something went wrong");

      toast.success("Drive successfully updated");
      router.push("/admin/drives");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to update drive");
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
            placeholder="Drive Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <p className="text-red-500 text-sm">{getError("name")}</p>

          <Textarea
            className="max-w-[75ch] mt-2"
            rows={5}
            placeholder="Drive Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <p className="text-red-500 text-sm">{getError("description")}</p>

          <h3 className="font-bold text-lg mt-4">Requirements</h3>
          <RichTextEditor
            content={form.requirements}
            onChange={(val) => setForm({ ...form, requirements: val })}
          />
          <p className="text-red-500 text-sm">{getError("requirements")}</p>

          <div className="mt-4">
            <MultipleFilesUpload label="Drive files" onChange={setFiles} />
            <p className="text-red-500 text-sm">{getError("files")}</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/2">
          <KeyPointsSection initialPoints={keyPoints} onChange={setKeyPoints} />
          <p className="text-red-500 text-sm">{getError("keyPoints")}</p>

          <div className="mt-6">
            <h2 className="font-bold text-lg mb-4">Candidate Eligibility</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1">Minimum CGPA</Label>
                <Input
                  type="number"
                  placeholder="Minimum CGPA"
                  value={form.cgpa}
                  onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
                />
                <p className="text-red-500 text-sm">{getError("cgpa")}</p>
              </div>

              <div>
                <Label className="mb-1">Semester</Label>
                <Select
                  className="mt-0"
                  classNames={{ control: () => "h-12" }}
                  options={[...Array(8)].map((_, i) => ({
                    label: `${i + 1}`,
                    value: i + 1,
                  }))}
                  value={allowedSem}
                  placeholder="Semester"
                  onChange={(val) => setAllowedSem(val as any)}
                />
                <p className="text-red-500 text-sm">{getError("allowedSem")}</p>
              </div>

              <div>
                <Label className="mb-1">Departments</Label>
                <Select
                  className="mt-0"
                  isMulti
                  styles={multiSelectStyles}
                  components={customMultiComponents}
                  classNames={{ control: () => "h-12" }}
                  options={departmentOptions}
                  value={departments}
                  placeholder="Departments"
                  onChange={(val) => setDepartments(val as any)}
                />
                <p className="text-red-500 text-sm">
                  {getError("departments")}
                </p>
                {renderSelectedBadges(departments, (v) =>
                  setDepartments((prev) => prev.filter((p) => p.value !== v))
                )}
              </div>

              <div>
                <Label className="mb-1">Pre-requisites</Label>
                <Select
                  className="mt-0"
                  isMulti
                  styles={multiSelectStyles}
                  components={customMultiComponents}
                  classNames={{ control: () => "h-12" }}
                  options={preRequisiteOptions}
                  value={preRequisites}
                  placeholder="Pre-requisites"
                  onChange={(val) => setPreRequisites(val as any)}
                />
                <p className="text-red-500 text-sm">
                  {getError("preRequisites")}
                </p>
                {renderSelectedBadges(preRequisites, (v) =>
                  setPreRequisites((prev) => prev.filter((p) => p.value !== v))
                )}
              </div>
            </div>
          </div>

          {/* Stages */}
          <div className="mt-6">
            <h2 className="font-bold text-lg mb-2">Stages</h2>
            {stages.map((stage) => (
              <div key={stage.id} className="flex gap-2 items-center mb-2">
                <Select
                  classNames={{ control: () => "h-12" }}
                  options={stageOptions} // or stage options
                  value={stage.stage}
                  onChange={(val) =>
                    setStages((prev) =>
                      prev.map((s) =>
                        s.id === stage.id ? { ...s, stage: val } : s
                      )
                    )
                  }
                />
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() =>
                    setStages((prev) => prev.filter((s) => s.id !== stage.id))
                  }
                >
                  Delete
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              type="button"
              onClick={() =>
                setStages((prev) => [
                  ...prev,
                  { id: crypto.randomUUID(), stage: null },
                ])
              }
            >
              Add Stage
            </Button>
          </div>
        </div>
      </section>

      <hr className="my-5" />

      {/* Meta Info */}
      <section className="flex flex-wrap gap-4">
        <div>
          <Label>Price</Label>
          <Input
            className="mt-2"
            type="number"
            value={form.basePrice}
            onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
          />
          <p className="text-red-500 text-sm">{getError("basePrice")}</p>
        </div>
        <div>
          <Label>Available Positions</Label>
          <Input
            className="mt-2"
            type="number"
            value={form.availablePositions}
            onChange={(e) =>
              setForm({ ...form, availablePositions: e.target.value })
            }
          />
          <p className="text-red-500 text-sm">
            {getError("availablePositions")}
          </p>
        </div>

        {/* Tag */}
        <div>
          <Label>Tag</Label>
          <Input
            className="mt-2"
            value={form.tag}
            onChange={(e) => setForm({ ...form, tag: e.target.value })}
          />
          <p className="text-red-500 text-sm">{getError("tag")}</p>
        </div>

        <div>
          <Label>Company Name</Label>
          <Input
            className="mt-2"
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          />
          <p className="text-red-500 text-sm">{getError("companyName")}</p>
        </div>
        <div>
          <Label>Bg Color</Label>
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
          <p className="text-red-500 text-sm">{getError("tag")}</p>
        </div>

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
            onChange={(val) => setAppliesTo(val as any)}
          />
          <p className="text-red-500 text-sm">{getError("appliesTo")}</p>
          {renderSelectedBadges(appliesTo, (v) =>
            setAppliesTo((prev) => prev.filter((p) => p.value !== v))
          )}
        </div>
      </section>

      <section className="flex justify-end w-full mt-8">
        <Button
          variant="link"
          type="button"
          onClick={() => router.push("/admin/drives")}
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
