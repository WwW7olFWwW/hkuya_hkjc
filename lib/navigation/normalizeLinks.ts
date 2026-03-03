export type HeaderLink = {
  titleZh: string
  titleEn: string
  href: string
  primary: boolean
}

export type FooterQuickLink = {
  label: string
  href: string
  primary: boolean
}

export type FooterSocialIcon = "facebook" | "instagram"

export type FooterSocialLink = {
  label: string
  href: string
  icon: FooterSocialIcon
}

function toNonEmptyString(value: unknown) {
  if (typeof value !== "string") {
    return ""
  }

  const normalized = value.trim()
  if (!normalized) {
    return ""
  }

  return normalized
}

function normalizeHref(value: unknown) {
  const href = toNonEmptyString(value)
  if (!href) {
    return ""
  }

  if (href.startsWith("#")) {
    return href
  }

  if (href.startsWith("/")) {
    return href
  }

  if (/^https:\/\/\S+$/i.test(href)) {
    return href
  }

  return ""
}

function normalizeBoolean(value: unknown) {
  return value === true
}

function normalizeSocialIcon(value: unknown): FooterSocialIcon | null {
  const icon = toNonEmptyString(value).toLowerCase()
  if (icon === "facebook") {
    return "facebook"
  }
  if (icon === "instagram") {
    return "instagram"
  }
  return null
}

function normalizeSinglePrimary<T extends { primary: boolean }>(items: T[]) {
  let hasPrimary = false
  for (const item of items) {
    if (!item.primary) {
      continue
    }

    if (hasPrimary) {
      item.primary = false
      continue
    }

    hasPrimary = true
  }
}

function cloneHeaderLinks(links: HeaderLink[]) {
  const result: HeaderLink[] = []
  for (const link of links) {
    result.push({
      titleZh: link.titleZh,
      titleEn: link.titleEn,
      href: link.href,
      primary: link.primary === true
    })
  }
  normalizeSinglePrimary(result)
  return result
}

function cloneFooterQuickLinks(links: FooterQuickLink[]) {
  const result: FooterQuickLink[] = []
  for (const link of links) {
    result.push({
      label: link.label,
      href: link.href,
      primary: link.primary === true
    })
  }
  normalizeSinglePrimary(result)
  return result
}

function cloneFooterSocialLinks(links: FooterSocialLink[]) {
  const result: FooterSocialLink[] = []
  for (const link of links) {
    result.push({
      label: link.label,
      href: link.href,
      icon: link.icon
    })
  }
  return result
}

export function normalizeHeaderLinks(input: unknown, fallback: HeaderLink[]) {
  if (!Array.isArray(input)) {
    return cloneHeaderLinks(fallback)
  }

  const normalized: HeaderLink[] = []

  for (const row of input) {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      continue
    }

    const record = row as Record<string, unknown>
    const titleZh = toNonEmptyString(record.titleZh)
    const titleEn = toNonEmptyString(record.titleEn)
    const href = normalizeHref(record.href)
    if (!titleZh || !titleEn || !href) {
      continue
    }

    normalized.push({
      titleZh: titleZh,
      titleEn: titleEn,
      href: href,
      primary: normalizeBoolean(record.primary)
    })
  }

  if (normalized.length === 0) {
    return cloneHeaderLinks(fallback)
  }

  normalizeSinglePrimary(normalized)
  return normalized
}

export function normalizeFooterQuickLinks(input: unknown, fallback: FooterQuickLink[]) {
  if (!Array.isArray(input)) {
    return cloneFooterQuickLinks(fallback)
  }

  const normalized: FooterQuickLink[] = []

  for (const row of input) {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      continue
    }

    const record = row as Record<string, unknown>
    const label = toNonEmptyString(record.label)
    const href = normalizeHref(record.href)
    if (!label || !href) {
      continue
    }

    normalized.push({
      label: label,
      href: href,
      primary: normalizeBoolean(record.primary)
    })
  }

  if (normalized.length === 0) {
    return cloneFooterQuickLinks(fallback)
  }

  normalizeSinglePrimary(normalized)
  return normalized
}

export function normalizeFooterSocialLinks(input: unknown, fallback: FooterSocialLink[]) {
  if (!Array.isArray(input)) {
    return cloneFooterSocialLinks(fallback)
  }

  const normalized: FooterSocialLink[] = []

  for (const row of input) {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      continue
    }

    const record = row as Record<string, unknown>
    const label = toNonEmptyString(record.label)
    const href = normalizeHref(record.href)
    const icon = normalizeSocialIcon(record.icon)
    if (!label || !href || !icon) {
      continue
    }

    normalized.push({
      label: label,
      href: href,
      icon: icon
    })
  }

  if (normalized.length === 0) {
    return cloneFooterSocialLinks(fallback)
  }

  return normalized
}

export function resolveConfiguredHref(
  href: string,
  withBaseResolver: { (path: string): string }
) {
  if (href.startsWith("/")) {
    return withBaseResolver(href)
  }

  return href
}
