type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function splitLines(value: string) {
  if (value.indexOf("\n") === -1) {
    return value
  }
  const lines = value.split(/\r?\n/)
  const cleaned: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed) {
      cleaned.push(trimmed)
    }
  }

  return cleaned
}

function mapWithTemplate(value: unknown, template: unknown): unknown {
  if (Array.isArray(template)) {
    if (template.length === 0) {
      return value
    }
    const sample = template[0]
    if (typeof sample === "string") {
      if (typeof value === "string") {
        return splitLines(value)
      }
      return value
    }
    if (isRecord(sample)) {
      if (Array.isArray(value)) {
        const mapped: unknown[] = []
        for (const item of value) {
          mapped.push(mapWithTemplate(item, sample))
        }
        return mapped
      }
      return value
    }
    return value
  }

  if (isRecord(template) && isRecord(value)) {
    const output: UnknownRecord = {}
    const keys = Object.keys(value)

    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(template, key)) {
        output[key] = mapWithTemplate(value[key], template[key])
      } else {
        output[key] = value[key]
      }
    }

    return output
  }

  return value
}

function mapWithNewlineFallback(value: unknown): unknown {
  if (typeof value === "string") {
    return splitLines(value)
  }

  if (Array.isArray(value)) {
    const mapped: unknown[] = []
    for (const item of value) {
      mapped.push(mapWithNewlineFallback(item))
    }
    return mapped
  }

  if (isRecord(value)) {
    const output: UnknownRecord = {}
    const keys = Object.keys(value)
    for (const key of keys) {
      output[key] = mapWithNewlineFallback(value[key])
    }
    return output
  }

  return value
}

export function mapSubmissionToContent(data: UnknownRecord, template?: UnknownRecord) {
  if (template) {
    return mapWithTemplate(data, template) as UnknownRecord
  }
  return mapWithNewlineFallback(data) as UnknownRecord
}
