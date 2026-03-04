import { defaultContent } from "./defaultContent"

type ContentMap = Record<string, { fields: Record<string, unknown> }>
type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function normalizeImagePath(value: unknown) {
  if (typeof value !== "string") {
    return value
  }

  const trimmed = value.trim()
  if (trimmed === "") {
    return trimmed
  }

  const normalized = trimmed.toLowerCase()
  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("data:") ||
    normalized.startsWith("blob:") ||
    trimmed.startsWith("/")
  ) {
    return trimmed
  }

  if (trimmed.indexOf("/") === -1) {
    return "/images/" + trimmed
  }

  return "/" + trimmed
}

function splitTextLines(value: string) {
  const segments = value.split(/\r?\n/)
  const cleaned: string[] = []

  for (const segment of segments) {
    const trimmed = segment.trim()
    if (trimmed !== "") {
      cleaned.push(trimmed)
    }
  }

  return cleaned
}

function normalizeStringList(value: unknown) {
  if (typeof value === "string") {
    return splitTextLines(value)
  }

  if (!Array.isArray(value)) {
    return []
  }

  const cleaned: string[] = []
  for (const item of value) {
    if (typeof item !== "string") {
      continue
    }

    const trimmed = item.trim()
    if (trimmed !== "") {
      cleaned.push(trimmed)
    }
  }

  return cleaned
}

function normalizeProjectIntroFields(fields: UnknownRecord) {
  if (Object.prototype.hasOwnProperty.call(fields, "posterUrl")) {
    fields.posterUrl = normalizeImagePath(fields.posterUrl)
  }
}

function normalizeAboutUsFields(fields: UnknownRecord) {
  const organizations = fields.organizations
  if (!Array.isArray(organizations)) {
    return
  }

  for (let index = 0; index < organizations.length; index += 1) {
    const organization = organizations[index]
    if (!isRecord(organization)) {
      continue
    }

    if (Object.prototype.hasOwnProperty.call(organization, "logo")) {
      organization.logo = normalizeImagePath(organization.logo)
    }
  }
}

function normalizeTimelineFields(fields: UnknownRecord) {
  const steps = fields.steps
  if (Array.isArray(steps)) {
    const normalizedSteps: UnknownRecord[] = []

    for (const step of steps) {
      if (!isRecord(step)) {
        continue
      }

      const normalizedStep: UnknownRecord = {}
      const keys = Object.keys(step)

      for (const key of keys) {
        normalizedStep[key] = step[key]
      }

      normalizedStep.content = normalizeStringList(step.content)
      normalizedSteps.push(normalizedStep)
    }

    fields.steps = normalizedSteps
  }

  const notes = fields.notes
  if (Array.isArray(notes)) {
    const normalizedNotes: UnknownRecord[] = []

    for (const note of notes) {
      if (!isRecord(note)) {
        continue
      }

      const normalizedNote: UnknownRecord = {}
      const keys = Object.keys(note)

      for (const key of keys) {
        normalizedNote[key] = note[key]
      }

      normalizedNote.content = normalizeStringList(note.content)
      normalizedNotes.push(normalizedNote)
    }

    fields.notes = normalizedNotes
  }
}

function fixBrokenStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return value
  }

  if (value.length === 0) {
    return value
  }

  const allSingleChars = value.every(function (item) {
    return typeof item === "string" && item.length === 1
  })

  if (allSingleChars) {
    return value.join("")
  }

  return value
}

function normalizePositionsFields(fields: UnknownRecord) {
  if (Object.prototype.hasOwnProperty.call(fields, "titleZh")) {
    fields.titleZh = fixBrokenStringArray(fields.titleZh)
  }

  if (Object.prototype.hasOwnProperty.call(fields, "titleEn")) {
    fields.titleEn = fixBrokenStringArray(fields.titleEn)
  }

  const groups = fields.groups
  if (!Array.isArray(groups)) {
    return
  }

  for (let groupIndex = 0; groupIndex < groups.length; groupIndex += 1) {
    const group = groups[groupIndex]
    if (!isRecord(group)) {
      continue
    }

    if (Object.prototype.hasOwnProperty.call(group, "location")) {
      group.location = fixBrokenStringArray(group.location)
    }

    if (Object.prototype.hasOwnProperty.call(group, "description")) {
      group.description = fixBrokenStringArray(group.description)
    }

    const positions = group.positions
    if (!Array.isArray(positions)) {
      continue
    }

    for (let posIndex = 0; posIndex < positions.length; posIndex += 1) {
      const position = positions[posIndex]
      if (!isRecord(position)) {
        continue
      }

      const stringArrayFields = ["companyLines", "roleLines", "requirements", "duties"]
      for (const fieldName of stringArrayFields) {
        if (!Object.prototype.hasOwnProperty.call(position, fieldName)) {
          continue
        }

        const fieldValue = position[fieldName]

        if (typeof fieldValue === "string") {
          position[fieldName] = normalizeStringList(fieldValue)
        } else if (Array.isArray(fieldValue)) {
          const fixedArray: string[] = []
          for (const item of fieldValue) {
            const fixed = fixBrokenStringArray(item)
            if (typeof fixed === "string") {
              fixedArray.push(fixed)
            }
          }
          position[fieldName] = fixedArray
        }
      }
    }
  }
}

export function normalizeContent(input: ContentMap) {
  const output: ContentMap = {}
  const keys = Object.keys(defaultContent)

  for (const key of keys) {
    const fallback = defaultContent[key as keyof typeof defaultContent]
    const incoming = input[key]

    if (!incoming) {
      output[key] = fallback
      continue
    }

    const mergedFields: Record<string, unknown> = {}
    const fieldKeys = Object.keys(fallback.fields)

    for (const fieldKey of fieldKeys) {
      if (incoming.fields && Object.prototype.hasOwnProperty.call(incoming.fields, fieldKey)) {
        const incomingValue = incoming.fields[fieldKey]
        mergedFields[fieldKey] = (incomingValue !== null && incomingValue !== undefined) ? incomingValue : fallback.fields[fieldKey]
      } else {
        mergedFields[fieldKey] = fallback.fields[fieldKey]
      }
    }

    output[key] = { fields: mergedFields }

    if (key === "project_intro") {
      normalizeProjectIntroFields(mergedFields)
    }

    if (key === "about_us") {
      normalizeAboutUsFields(mergedFields)
    }

    if (key === "timeline") {
      normalizeTimelineFields(mergedFields)
    }

    if (key === "positions") {
      normalizePositionsFields(mergedFields)
    }
  }

  return output
}
