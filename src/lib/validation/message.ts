import { z } from 'zod'
import { ShortString, Email, LongString } from './primitives'

export const MessageCreate = z.object({
  name: ShortString,
  email: Email,
  message: LongString,
})

export type MessageCreateDTO = z.infer<typeof MessageCreate>


