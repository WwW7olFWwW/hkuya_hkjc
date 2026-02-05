type FormioFacade = {
  createForm?: { (): void }
  builder?: { (): void }
}

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null
}

function isFormioFacade(value: unknown): value is FormioFacade {
  if (typeof value !== "function" && !isRecord(value)) {
    return false
  }
  const candidate = value as FormioFacade
  return typeof candidate.createForm === "function" || typeof candidate.builder === "function"
}

function resolveFromRecord(record: UnknownRecord): FormioFacade | null {
  if (isFormioFacade(record.Formio)) {
    return record.Formio as FormioFacade
  }

  if (isRecord(record.default)) {
    const defaultRecord = record.default as UnknownRecord
    if (isFormioFacade(defaultRecord.Formio)) {
      return defaultRecord.Formio as FormioFacade
    }
    if (isFormioFacade(defaultRecord)) {
      return defaultRecord as FormioFacade
    }
  }

  if (isFormioFacade(record)) {
    return record as FormioFacade
  }

  return null
}

function resolveFromGlobal(): FormioFacade | null {
  if (typeof globalThis === "undefined") {
    return null
  }
  const globalRecord = globalThis as { Formio?: unknown }
  if (isFormioFacade(globalRecord.Formio)) {
    return globalRecord.Formio as FormioFacade
  }
  return null
}

export function resolveFormioFacade(module: unknown): FormioFacade | null {
  if (isRecord(module)) {
    const resolved = resolveFromRecord(module)
    if (resolved) {
      return resolved
    }
  }

  return resolveFromGlobal()
}
