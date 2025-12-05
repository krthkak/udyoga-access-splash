import { z } from 'zod'
import { ShortString } from './primitives'
import { InstitutionStatus } from './enums'

export const InstitutionCreate = z.object({
  name: ShortString,
  city: ShortString,
  state: ShortString,
  status: InstitutionStatus.optional(),
})

export const InstitutionUpdate = InstitutionCreate.partial()

export type InstitutionCreateDTO = z.infer<typeof InstitutionCreate>
export type InstitutionUpdateDTO = z.infer<typeof InstitutionUpdate>


