import { z } from 'zod'
import { Id, FloatNonNegative, ShortString } from './primitives'
import { PaymentStatus, TransactionType } from './enums'

export const PaymentCreate = z.object({
  transaction_id: ShortString,
  amount: FloatNonNegative,
  payment_status: PaymentStatus,
  payment_mode: ShortString,
  user_id: Id,
  transaction_type: TransactionType,
  activity_id: Id.optional(),
  drive_id: Id.optional(),
})

export const PaymentUpdate = PaymentCreate.partial()

export type PaymentCreateDTO = z.infer<typeof PaymentCreate>
export type PaymentUpdateDTO = z.infer<typeof PaymentUpdate>


