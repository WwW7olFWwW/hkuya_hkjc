import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const createClient = vi.hoisted(function () {
  return vi.fn()
})

vi.mock("@supabase/supabase-js", function () {
  return {
    createClient: createClient
  }
})

describe("getSupabaseClient", function () {
  beforeEach(function () {
    createClient.mockReset()
  })

  afterEach(function () {
    delete (globalThis as Record<string, unknown>).__SUPABASE_URL__
    delete (globalThis as Record<string, unknown>).__SUPABASE_ANON_KEY__
    vi.resetModules()
  })

  it("creates client using runtime env", async function () {
    ;(globalThis as Record<string, unknown>).__SUPABASE_URL__ = "https://example.supabase.co"
    ;(globalThis as Record<string, unknown>).__SUPABASE_ANON_KEY__ = "anon-key"

    const module = await import("../../lib/supabase/client")
    module.getSupabaseClient()

    expect(createClient).toHaveBeenCalledWith("https://example.supabase.co", "anon-key")
  })
})
