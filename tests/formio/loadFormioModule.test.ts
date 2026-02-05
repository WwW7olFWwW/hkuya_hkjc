import { describe, it, expect, vi } from "vitest"
import { loadFormioModule } from "../../lib/formio/loadFormio"

vi.mock("@formio/js/dist/formio.full.min.js", function () {
  return {
    Formio: {
      marker: "mock"
    }
  }
})

describe("loadFormioModule", function () {
  it("loads the minified formio bundle", async function () {
    const module = await loadFormioModule()

    expect(module.Formio && module.Formio.marker).toBe("mock")
  })
})
