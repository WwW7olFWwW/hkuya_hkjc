import { defaultContent } from "./defaultContent"

type ContentMap = Record<string, { fields: Record<string, unknown> }>

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
        mergedFields[fieldKey] = incoming.fields[fieldKey]
      } else {
        mergedFields[fieldKey] = fallback.fields[fieldKey]
      }
    }

    output[key] = { fields: mergedFields }
  }

  return output
}
