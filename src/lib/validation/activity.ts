import { z } from "zod";
import { Id, LongString, ShortString, FloatNonNegative } from "./primitives";
import { ActivityType, EntityStatus } from "./enums";

export const ActivityCreate = z.object({
  name: ShortString,
  type: ActivityType,
  external_url: z.string().url().optional(),
  details: LongString,
  applies: z.array(Id).default([]),
  departments: z.array(Id).default([]),
  baseprice: FloatNonNegative,
  status: EntityStatus.optional(),
});

export const ActivityUpdate = ActivityCreate.partial();

export type ActivityCreateDTO = z.infer<typeof ActivityCreate>;
export type ActivityUpdateDTO = z.infer<typeof ActivityUpdate>;

// Dropdown or Semester option types
const SemesterOptionSchema = z.object({
  label: z.string(),
  value: z.number(),
});

const KeyPointSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(1, "Key point cannot be empty"),
});

const DropdownOptionSchema = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number()]),
});

// The main validation schema
export const ActivityFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  tag: z.string("Tag is required").min(1, "Tag is required"),
  internalName: z.string().min(1, "Internal name is required"),
  bgColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color code"),
  description: z.string().min(1, "Description is required"),
  editorState: z.any(), // SerializedEditorState (can't be easily validated)
  keyPoints: z.array(KeyPointSchema).min(1, "At least one key point required"),
  cgpa: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 10),
      "CGPA must be between 0 and 10"
    ),
  allowedSem: SemesterOptionSchema.optional().nullable(),
  files: z.array(z.instanceof(File)).optional(),
  image: z.instanceof(File).nullable(),
  basePrice: z
    .string()
    .min(1, "Base price is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Base price must be a valid non-negative number"
    ),
  appliesTo: z
    .array(DropdownOptionSchema, "At least one apply option is required")
    .min(1, "At least one apply option is required"),
  departments: z.array(DropdownOptionSchema).optional(),
  category: z.string("Category is required").min(1, "Category is required"),
  appliesToOptions: z.array(DropdownOptionSchema).optional(),
  external_url: z
    .string()
    .url("Invalid URL format")
    .or(z.literal(""))
    .optional(),
});
