import { z } from 'zod'
import { DocumentType } from './enums'
import { LongString, ShortString } from './primitives'

export const DocumentCreate = z.object({
  document_type: DocumentType,
  file_type: ShortString,
  file_url: LongString,
})

export const DocumentUpdate = DocumentCreate.partial()

export type DocumentCreateDTO = z.infer<typeof DocumentCreate>
export type DocumentUpdateDTO = z.infer<typeof DocumentUpdate>


