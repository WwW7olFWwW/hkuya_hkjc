import { describe, it, expect } from "vitest"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const formio = require("@formio/js")

describe("formio dependency", function () {
  it("loads @formio/js", function () {
    expect(formio).toBeTruthy()
  })
})
