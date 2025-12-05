import { z } from "zod";
import { Id, LongString, ShortString, IntNonNegative } from "./primitives";
import { EntityStatus } from "./enums";

export const DriveCreate = z.object({
  name: ShortString,
  available_positions: IntNonNegative,
  company_details: LongString,
  requirements: LongString,
  documents: z.array(Id).default([]),
  applies: z.array(Id).default([]),
  status: EntityStatus.optional(),
});

export const DriveUpdate = DriveCreate.partial();

export type DriveCreateDTO = z.infer<typeof DriveCreate>;
export type DriveUpdateDTO = z.infer<typeof DriveUpdate>;

export const DriveCreateFE = z.object({
  name: ShortString,
  description: LongString,
  requirements: LongString,
  keyPoints: z.array(z.string()).default([]),
  availablePositions: IntNonNegative,
  tag: LongString.optional(),
  documents: z.array(Id).default([]),
  image: z.instanceof(File).nullable(),
  appliesTo: z.array(Id).min(1, "Minimum one is required").default([]),
  stages: z.array(Id).default([]),
  preRequisites: z.array(Id).default([]),
  departments: z.array(Id).default([]),
  allowedSem: IntNonNegative.optional(),
  cgpa: z.number().min(0).max(10).optional(),
  basePrice: z.number().min(0).optional(),
  companyName: z.string(),
  status: EntityStatus.optional(),
  bgColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color code"),
});

export const DriveUpdateFE = DriveCreateFE.partial();

export type DriveCreateFEDTO = z.infer<typeof DriveCreateFE>;
export type DriveUpdateFEDTO = z.infer<typeof DriveUpdateFE>;
