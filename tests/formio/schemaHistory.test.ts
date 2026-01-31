import { describe, it, expect } from "vitest"
import { trimHistoryForSlug } from "../../lib/formio/schemaHistory"

describe("trimHistoryForSlug", function () {
  it("keeps latest 7 entries per slug", function () {
    const items = [] as Array<{ slug: string; created_at: string }>
    for (let index = 0; index < 9; index += 1) {
      items.push({ slug: "positions", created_at: "2026-01-" + (index + 1) })
    }
    const trimmed = trimHistoryForSlug(items, "positions", 7)
    expect(trimmed.length).toBe(7)
  })
})
