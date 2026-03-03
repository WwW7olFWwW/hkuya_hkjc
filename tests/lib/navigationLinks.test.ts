import { describe, it, expect } from "vitest"
import {
  normalizeHeaderLinks,
  normalizeFooterQuickLinks,
  normalizeFooterSocialLinks,
  resolveConfiguredHref
} from "../../lib/navigation/normalizeLinks"

describe("normalizeHeaderLinks", function () {
  it("keeps only one primary item", function () {
    const result = normalizeHeaderLinks(
      [
        { titleZh: "A", titleEn: "A", href: "#a", primary: true },
        { titleZh: "B", titleEn: "B", href: "#b", primary: true }
      ],
      []
    )

    expect(result.length).toBe(2)
    expect(result[0].primary).toBe(true)
    expect(result[1].primary).toBe(false)
  })
})

describe("normalizeFooterQuickLinks", function () {
  it("filters invalid href", function () {
    const result = normalizeFooterQuickLinks(
      [
        { label: "ok", href: "https://example.com", primary: false },
        { label: "bad", href: "javascript:alert(1)", primary: false }
      ],
      []
    )

    expect(result.length).toBe(1)
    expect(result[0].label).toBe("ok")
  })
})

describe("normalizeFooterSocialLinks", function () {
  it("keeps supported icons only", function () {
    const result = normalizeFooterSocialLinks(
      [
        { label: "Facebook", href: "https://example.com", icon: "facebook" },
        { label: "Unknown", href: "https://example.com", icon: "x" }
      ],
      []
    )

    expect(result.length).toBe(1)
    expect(result[0].icon).toBe("facebook")
  })
})

describe("resolveConfiguredHref", function () {
  it("applies base resolver to internal paths", function () {
    const href = resolveConfiguredHref("/admin.html", function (path: string) {
      return "/hkjc" + path
    })

    expect(href).toBe("/hkjc/admin.html")
  })
})
