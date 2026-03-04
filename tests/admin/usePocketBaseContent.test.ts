import { describe, it, expect, vi, beforeEach } from "vitest"
import { usePocketBaseContent } from "../../lib/admin/usePocketBaseContent"

vi.mock("@/lib/pocketbase/client", function () {
  return {
    getPocketBaseClient: vi.fn()
  }
})

describe("usePocketBaseContent", function () {
  beforeEach(function () {
    vi.clearAllMocks()
  })

  it("initializes with empty state", function () {
    const { state } = usePocketBaseContent("contact")

    expect(state.value.fields).toEqual({})
    expect(state.value.loading).toBe(false)
    expect(state.value.saving).toBe(false)
    expect(state.value.error).toBe(null)
    expect(state.value.dirty).toBe(false)
  })
})
