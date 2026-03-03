type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function splitLines(value: string) {
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

function splitLinesOrString(value: string) {
  if (value.indexOf("\n") === -1) {
    return value
  }
  return splitLines(value)
}

function isString(value: unknown): value is string {
  return typeof value === "string"
}

function normalizeRelativeImagePath(value: string) {
  const trimmed = value.trim()
  if (trimmed.startsWith("images/")) {
    return "/" + trimmed
  }
  return trimmed
}

function isBareFileName(value: string) {
  const trimmed = value.trim()
  if (trimmed === "") {
    return false
  }

  if (
    trimmed.indexOf("/") !== -1 ||
    trimmed.indexOf("\\") !== -1 ||
    trimmed.indexOf("?") !== -1 ||
    trimmed.indexOf("#") !== -1
  ) {
    return false
  }

  return true
}

function shouldUseTemplateValue(extracted: string, templateValue: string) {
  if (!isBareFileName(extracted)) {
    return false
  }

  const cleanedTemplate = templateValue.split("?")[0].split("#")[0]
  return cleanedTemplate === extracted || cleanedTemplate.endsWith("/" + extracted)
}

function normalizeExtractedUrl(extracted: string, templateValue: string | null) {
  const normalized = normalizeRelativeImagePath(extracted)

  if (templateValue && shouldUseTemplateValue(normalized, templateValue)) {
    return templateValue
  }

  if (
    templateValue &&
    templateValue.startsWith("/") &&
    normalized.startsWith("/") &&
    normalized.endsWith(templateValue)
  ) {
    return templateValue
  }

  return normalized
}

function extractUrlFromFileRecord(value: UnknownRecord, templateValue: string | null) {
  const rawData = value.data
  if (isString(rawData) && rawData.trim() !== "") {
    if (rawData.startsWith("data:")) {
      return rawData
    }

    const mimeType = value.type
    if (isString(mimeType) && mimeType.indexOf("/") !== -1) {
      return "data:" + mimeType + ";base64," + rawData
    }

    return rawData
  }

  const directUrl = value.url
  if (isString(directUrl) && directUrl.trim() !== "") {
    return normalizeExtractedUrl(directUrl, templateValue)
  }

  const downloadUrl = value.downloadUrl
  if (isString(downloadUrl) && downloadUrl.trim() !== "") {
    return normalizeExtractedUrl(downloadUrl, templateValue)
  }

  return null
}

function normalizeStringTemplateValue(value: unknown, templateValue: string | null) {
  if (typeof value === "string") {
    return value
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return ""
    }
    for (let index = value.length - 1; index >= 0; index -= 1) {
      const item = value[index]
      if (isRecord(item)) {
        const extracted = extractUrlFromFileRecord(item, templateValue)
        if (typeof extracted === "string") {
          return extracted
        }
      }
      if (typeof item === "string") {
        return normalizeExtractedUrl(item, templateValue)
      }
    }
    return value
  }

  if (isRecord(value)) {
    const extracted = extractUrlFromFileRecord(value, templateValue)
    if (typeof extracted === "string") {
      return extracted
    }
  }

  return value
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
      if (Array.isArray(value)) {
        return value
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

  if (typeof template === "string") {
    return normalizeStringTemplateValue(value, template)
  }

  return value
}

function mapWithNewlineFallback(value: unknown): unknown {
  if (typeof value === "string") {
    return splitLinesOrString(value)
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
