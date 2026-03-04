import { describe, it, expect, vi, beforeEach } from "vitest"
import { usePocketBaseContent } from "../../lib/admin/usePocketBaseContent"
import { defaultContent } from "../../lib/content/defaultContent"

vi.mock("@/lib/pocketbase/client", function () {
  return {
    getPocketBaseClient: vi.fn()
  }
})

describe("usePocketBaseContent", function () {
  beforeEach(function () {
    vi.clearAllMocks()
  })

  it("initializes with default content", function () {
    const { state } = usePocketBaseContent("contact")

    expect(state.value.fields).toEqual(defaultContent.contact.fields)
    expect(state.value.loading).toBe(false)
    expect(state.value.saving).toBe(false)
    expect(state.value.error).toBe(null)
    expect(state.value.dirty).toBe(false)
  })
})
