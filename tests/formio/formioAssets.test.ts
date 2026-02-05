import { describe, it, expect } from "vitest"
import { buildFormioAssets, applyFormioAssets } from "../../lib/formio/formioAssets"

describe("buildFormioAssets", function () {
  it("builds assets with trailing slash base", function () {
    const assets = buildFormioAssets("/hkjc/")

    expect(assets.script).toBe("/hkjc/formio/formio.full.min.js")
    expect(assets.style).toBe("/hkjc/formio/formio.full.min.css")
    expect(assets.embedCSS).toBe("/hkjc/formio/formio.embed.css")
  })

  it("builds assets without trailing slash base", function () {
    const assets = buildFormioAssets("/hkjc")

    expect(assets.script).toBe("/hkjc/formio/formio.full.min.js")
    expect(assets.style).toBe("/hkjc/formio/formio.full.min.css")
    expect(assets.embedCSS).toBe("/hkjc/formio/formio.embed.css")
  })
})

describe("applyFormioAssets", function () {
  it("applies config defaults", function () {
    const formio = {
      config: {}
    } as { config: Record<string, unknown> }

    applyFormioAssets(formio, "/hkjc/")

    expect(formio.config.script).toBe("/hkjc/formio/formio.full.min.js")
    expect(formio.config.style).toBe("/hkjc/formio/formio.full.min.css")
    expect(formio.config.embedCSS).toBe("/hkjc/formio/formio.embed.css")
    expect(formio.config.full).toBe(true)
  })
})
