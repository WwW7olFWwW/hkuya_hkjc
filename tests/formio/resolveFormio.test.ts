import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { resolveFormioFacade } from "../../lib/formio/resolveFormio"

type FormioFacade = {
  createForm?: { (): void }
  builder?: { (): void }
}

describe("resolveFormioFacade", function () {
  let originalFormio: unknown

  beforeEach(function () {
    originalFormio = (globalThis as { Formio?: unknown }).Formio
  })

  afterEach(function () {
    if (typeof originalFormio === "undefined") {
      delete (globalThis as { Formio?: unknown }).Formio
      return
    }
    ;(globalThis as { Formio?: unknown }).Formio = originalFormio
  })

  it("prefers module.Formio when available", function () {
    const facade: FormioFacade = {
      createForm: function () {},
      builder: function () {}
    }
    const module = { Formio: facade }

    expect(resolveFormioFacade(module)).toBe(facade)
  })

  it("falls back to module.default.Formio", function () {
    const facade: FormioFacade = {
      createForm: function () {},
      builder: function () {}
    }
    const module = { default: { Formio: facade } }

    expect(resolveFormioFacade(module)).toBe(facade)
  })

  it("falls back to global Formio for UMD bundles", function () {
    const facade: FormioFacade = {
      createForm: function () {},
      builder: function () {}
    }
    const module = {}

    ;(globalThis as { Formio?: unknown }).Formio = facade

    expect(resolveFormioFacade(module)).toBe(facade)
  })
})
