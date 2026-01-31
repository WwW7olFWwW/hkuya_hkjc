import { describe, it, expect } from "vitest"
import { buildExportPath } from "../../scripts/export-formio-schema"

describe("buildExportPath", function () {
  it("creates repo path for slug", function () {
    const result = buildExportPath("positions")
    expect(result).toContain("lib/forms/formio/positions.json")
  })
})
