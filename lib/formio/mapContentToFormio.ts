type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function inferMimeTypeFromUrl(url: string) {
  const lower = url.toLowerCase()

  if (lower.startsWith("data:")) {
    const separatorIndex = lower.indexOf(";")
    if (separatorIndex > 5) {
      return lower.slice(5, separatorIndex)
    }
    return "image/*"
  }

  if (lower.endsWith(".png")) {
    return "image/png"
  }
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
    return "image/jpeg"
  }
  if (lower.endsWith(".webp")) {
    return "image/webp"
  }
  if (lower.endsWith(".gif")) {
    return "image/gif"
  }
  if (lower.endsWith(".svg")) {
    return "image/svg+xml"
  }

  return "image/*"
}

function inferFileNameFromUrl(url: string, fallbackBase: string) {
  const lower = url.toLowerCase()
  if (lower.startsWith("data:")) {
    return fallbackBase + ".png"
  }

  const cleanUrl = url.split("?")[0].split("#")[0]
  const slashIndex = cleanUrl.lastIndexOf("/")
  if (slashIndex >= 0 && slashIndex < cleanUrl.length - 1) {
    const name = cleanUrl.slice(slashIndex + 1)
    if (name.trim() !== "") {
      return name
    }
  }

  return fallbackBase + ".png"
}

function normalizeImageReference(url: string) {
  const trimmed = url.trim()
  if (trimmed.startsWith("images/")) {
    return "/" + trimmed
  }

  if (
    trimmed.indexOf("/") === -1 &&
    !trimmed.startsWith("http") &&
    !trimmed.startsWith("data:") &&
    !trimmed.startsWith("blob:")
  ) {
    return "/images/" + trimmed
  }

  return trimmed
}

function normalizeBaseUrl(baseUrl: string) {
  if (!baseUrl || baseUrl === "/") {
    return "/"
  }

  let normalized = baseUrl.trim()
  if (!normalized.startsWith("/")) {
    normalized = "/" + normalized
  }
  if (!normalized.endsWith("/")) {
    normalized = normalized + "/"
  }
  return normalized
}

function buildFormioPreviewUrl(url: string, baseUrl: string) {
  const normalizedBase = normalizeBaseUrl(baseUrl)
  if (normalizedBase === "/") {
    return url
  }

  if (!url.startsWith("/") || url.startsWith("//")) {
    return url
  }

  const basePrefix = normalizedBase.slice(0, -1)
  if (url === basePrefix || url.startsWith(basePrefix + "/")) {
    return url
  }

  return basePrefix + url
}

function buildFileValueFromString(url: string, fallbackBase: string, baseUrl: string) {
  const trimmed = url.trim()
  if (trimmed === "") {
    return []
  }

  const normalizedRef = normalizeImageReference(trimmed)
  const fileName = inferFileNameFromUrl(normalizedRef, fallbackBase)
  const mimeType = inferMimeTypeFromUrl(normalizedRef)
  const previewUrl = buildFormioPreviewUrl(normalizedRef, baseUrl)

  return [
    {
      name: fileName,
      originalName: fileName,
      size: 0,
      type: mimeType,
      url: previewUrl,
      downloadUrl: previewUrl,
      storage: "base64"
    }
  ]
}

function normalizeFileLikeValue(value: unknown, fallbackBase: string, baseUrl: string) {
  if (typeof value === "string") {
    return buildFileValueFromString(value, fallbackBase, baseUrl)
  }

  if (Array.isArray(value)) {
    return value
  }

  if (isRecord(value)) {
    return [value]
  }

  return value
}

function normalizeAboutUsFieldsWithBase(fields: UnknownRecord, baseUrl: string) {
  if (!Array.isArray(fields.organizations)) {
    return
  }

  const organizations = fields.organizations as unknown[]

  for (let index = 0; index < organizations.length; index += 1) {
    const organization = organizations[index]
    if (!isRecord(organization)) {
      continue
    }

    if (Object.prototype.hasOwnProperty.call(organization, "logo")) {
      organization.logo = normalizeFileLikeValue(organization.logo, "organization-logo", baseUrl)
    }
  }
}

function normalizeProjectIntroFields(fields: UnknownRecord, baseUrl: string) {
  if (!Object.prototype.hasOwnProperty.call(fields, "posterUrl")) {
    return
  }

  fields.posterUrl = normalizeFileLikeValue(fields.posterUrl, "project-poster", baseUrl)
}

function cloneFields(fields: UnknownRecord) {
  return JSON.parse(JSON.stringify(fields)) as UnknownRecord
}

export function mapContentToFormioSubmission(slug: string, fields: UnknownRecord, baseUrl: string = "/") {
  if (slug !== "about_us" && slug !== "project_intro") {
    return fields
  }

  const cloned = cloneFields(fields)

  if (slug === "about_us") {
    normalizeAboutUsFieldsWithBase(cloned, baseUrl)
    return cloned
  }

  if (slug === "project_intro") {
    normalizeProjectIntroFields(cloned, baseUrl)
    return cloned
  }

  return cloned
}
