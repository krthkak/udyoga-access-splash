import { z } from 'zod'
import type { SchemaRegistry, ValidatorAdapter, ValidationResult } from './facade'

export type ZodSchema = z.ZodTypeAny

export class InMemorySchemaRegistry implements SchemaRegistry<ZodSchema> {
  constructor(private readonly store: Map<string, ZodSchema>) {}
  get(schemaId: string): ZodSchema | undefined {
    return this.store.get(schemaId)
  }
}

export const zodAdapter: ValidatorAdapter<ZodSchema> = {
  validate<T>(schema: ZodSchema, input: unknown): ValidationResult<T> {
    const parsed = schema.safeParse(input)
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => ({ path: i.path.join('.') || '', message: i.message }))
      return { success: false, error: { issues } }
    }
    return { success: true, data: parsed.data as T }
  },
  parseOrThrow<T>(schema: ZodSchema, input: unknown): T {
    const parsed = schema.parse(input)
    return parsed as T
  },
}
