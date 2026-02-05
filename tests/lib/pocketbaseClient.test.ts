import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const PocketBase = vi.hoisted(function () {
  return vi.fn()
})

vi.mock("pocketbase", function () {
  return {
    default: PocketBase
  }
})

describe("getPocketBaseClient", function () {
  beforeEach(function () {
    PocketBase.mockReset()
  })

  afterEach(function () {
    delete (globalThis as Record<string, unknown>).__POCKETBASE_URL__
    vi.resetModules()
  })

  it("creates client using runtime env", async function () {
    ;(globalThis as Record<string, unknown>).__POCKETBASE_URL__ = "http://127.0.0.1:8090"

    const module = await import("../../lib/pocketbase/client")
    module.getPocketBaseClient()

    expect(PocketBase).toHaveBeenCalledWith("http://127.0.0.1:8090")
  })
})
