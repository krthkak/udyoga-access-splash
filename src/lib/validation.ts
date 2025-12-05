import { z } from "zod";
import { InMemorySchemaRegistry } from "./validation/zodAdapter";
import { zodAdapter } from "./validation/zodAdapter";
import { Validator } from "./validation/facade";
import { CandidateCreate } from "./validation/candidate";
import { ActivityCreate, ActivityFormSchema } from "./validation/activity";
import { DriveCreate, DriveCreateFE } from "./validation/drive";
import { InstitutionCreate } from "./validation/institution";
import { PaymentCreate } from "./validation/payment";
import { DocumentCreate } from "./validation/document";
import { MessageCreate } from "./validation/message";

// Contact schema moved to its own module

// Registry and facade (can be moved to a separate bootstrap file if needed)
const registryMap = new Map<string, z.ZodTypeAny>([
  ["message.create", MessageCreate],
  ["candidate.create", CandidateCreate],
  ["activity.create", ActivityCreate],
  ["drive.create", DriveCreate],
  ["institution.create", InstitutionCreate],
  ["payment.create", PaymentCreate],
  ["document.create", DocumentCreate],
  ["activity.create.fe", ActivityFormSchema],
  ["drive.create.fe", DriveCreateFE],
]);

const registry = new InMemorySchemaRegistry(registryMap);
export const validator = new Validator(zodAdapter, registry);
