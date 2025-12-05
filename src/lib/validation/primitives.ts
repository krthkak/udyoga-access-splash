import { z } from 'zod'

export const Id = z.string().uuid()
export const OptionalId = Id.optional()

export const NonEmptyString = z.string().trim().min(1)
export const ShortString = z.string().trim().min(1).max(100)
export const LongString = z.string().trim().min(1).max(2000)
export const Email = z.string().trim().email().max(256)

export const IntNonNegative = z.number().int().min(0)
export const IntPositive = z.number().int().min(1)
export const FloatNonNegative = z.number().min(0)

export const Timestamp = z.coerce.date()

export const Pagination = z.object({
  cursor: z.string().optional(),
  limit: IntPositive.max(100).default(20),
  order: z.enum(['asc', 'desc']).default('desc'),
})


