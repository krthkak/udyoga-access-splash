import { z } from "zod";
import {
  Id,
  IntNonNegative,
  IntPositive,
  LongString,
  ShortString,
} from "./primitives";
import { Gender } from "./enums";

export const CandidateCreate = z.object({
  user_id: Id,
  student_id: ShortString,
  age: IntPositive.max(120),
  gender: Gender,
  institution_id: Id,
  department_id: Id,
  semester: IntNonNegative.max(12),
  bio: LongString.optional(),
  resume: Id.optional(),
  additional_documents: z.array(Id).default([]),
  cgpa: z.number().min(0).max(10).optional(),
  hobbies: z.array(Id).default([]),
  certifications: z.array(Id).default([]),
});

export const CandidateUpdate = CandidateCreate.partial();

export type CandidateCreateDTO = z.infer<typeof CandidateCreate>;
export type CandidateUpdateDTO = z.infer<typeof CandidateUpdate>;
