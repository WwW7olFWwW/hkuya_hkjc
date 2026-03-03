import { describe, it, expect } from "vitest"
import { mapContentToFormioSubmission } from "../../lib/formio/mapContentToFormio"

describe("mapContentToFormioSubmission", function () {
  it("converts about_us organization logo string into file array", function () {
    const fields = {
      organizations: [
        {
          role: "合作機構",
          name: "Test Org",
          logo: "https://example.com/assets/logo.webp",
          url: "https://example.com"
        }
      ]
    }

    const result = mapContentToFormioSubmission("about_us", fields as Record<string, unknown>)
    const organizations = result.organizations as Array<Record<string, unknown>>
    const logoValue = organizations[0].logo as Array<Record<string, unknown>>

    expect(Array.isArray(logoValue)).toBe(true)
    expect(logoValue.length).toBe(1)
    expect(logoValue[0].url).toBe("https://example.com/assets/logo.webp")
    expect(logoValue[0].storage).toBe("base64")
    expect(logoValue[0].type).toBe("image/webp")
  })

  it("converts project_intro posterUrl string into file array", function () {
    const fields = {
      posterUrl: "data:image/png;base64,abc123"
    }

    const result = mapContentToFormioSubmission("project_intro", fields as Record<string, unknown>)
    const posterValue = result.posterUrl as Array<Record<string, unknown>>

    expect(Array.isArray(posterValue)).toBe(true)
    expect(posterValue.length).toBe(1)
    expect(posterValue[0].url).toBe("data:image/png;base64,abc123")
    expect(posterValue[0].storage).toBe("base64")
    expect(posterValue[0].type).toBe("image/png")
  })

  it("adds base path for local preview urls in admin form", function () {
    const fields = {
      posterUrl: "/images/poster.webp"
    }

    const result = mapContentToFormioSubmission("project_intro", fields as Record<string, unknown>, "/hkjc/")
    const posterValue = result.posterUrl as Array<Record<string, unknown>>

    expect(posterValue[0].url).toBe("/hkjc/images/poster.webp")
    expect(posterValue[0].downloadUrl).toBe("/hkjc/images/poster.webp")
  })

  it("keeps non-target slug as original object", function () {
    const fields = {
      titleZh: "TimeLine"
    }

    const result = mapContentToFormioSubmission("timeline", fields as Record<string, unknown>)
    expect(result).toBe(fields)
  })

  it("does not mutate original fields for target slugs", function () {
    const fields = {
      posterUrl: "https://example.com/poster.png"
    }

    const result = mapContentToFormioSubmission("project_intro", fields as Record<string, unknown>)
    expect(typeof fields.posterUrl).toBe("string")
    expect(Array.isArray(result.posterUrl)).toBe(true)
  })
})
