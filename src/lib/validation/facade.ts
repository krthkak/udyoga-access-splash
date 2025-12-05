export type ValidationIssue = { path: string; message: string }
export type NormalizedError = { issues: ValidationIssue[] }

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: NormalizedError }

export interface ValidatorAdapter<S> {
  validate<T>(schema: S, input: unknown): ValidationResult<T>
  parseOrThrow<T>(schema: S, input: unknown): T
}

export interface SchemaRegistry<S> {
  get(schemaId: string): S | undefined
}

export class Validator<S> {
  constructor(private readonly adapter: ValidatorAdapter<S>, private readonly registry: SchemaRegistry<S>) {}

  validate<T>(schemaId: string, input: unknown): ValidationResult<T> {
    const schema = this.registry.get(schemaId)
    if (!schema) return { success: false, error: { issues: [{ path: 'schema', message: `schema_not_found: ${schemaId}` }] } }
    return this.adapter.validate<T>(schema, input)
  }

  parseOrThrow<T>(schemaId: string, input: unknown): T {
    const schema = this.registry.get(schemaId)
    if (!schema) throw new Error(`schema_not_found: ${schemaId}`)
    return this.adapter.parseOrThrow<T>(schema, input)
  }
}
