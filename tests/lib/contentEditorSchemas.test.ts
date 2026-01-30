import { describe, it, expect } from "vitest"
import { getBlockSchema, getBlockUiSchema } from "../../lib/content/contentEditorSchemas"

describe("contentEditorSchemas", function () {
  it("builds timeline schema with array items", function () {
    const schema = getBlockSchema("timeline")
    expect(schema.type).toBe("object")
    expect(schema.properties).toBeTruthy()
    expect(schema.properties.steps.type).toBe("array")
    expect(schema.properties.steps.items.type).toBe("object")
    expect(schema.properties.steps.items.properties.date.type).toBe("string")
  })

  it("builds positions schema with nested arrays", function () {
    const schema = getBlockSchema("positions")
    expect(schema.properties.groups.type).toBe("array")
    expect(schema.properties.groups.items.properties.positions.type).toBe("array")
    expect(schema.properties.groups.items.properties.positions.items.properties.companyLines.type).toBe("array")
  })

  it("builds about_us schema with organizations array", function () {
    const schema = getBlockSchema("about_us")
    expect(schema.properties.organizations.type).toBe("array")
    expect(schema.properties.organizations.items.type).toBe("object")
  })

  it("builds contact schema with email and tel", function () {
    const schema = getBlockSchema("contact")
    expect(schema.properties.email.type).toBe("string")
    expect(schema.properties.tel.type).toBe("string")
  })

  it("builds timeline ui schema with array detail", function () {
    const uiSchema = getBlockUiSchema("timeline")
    expect(uiSchema.type).toBe("VerticalLayout")
    expect(uiSchema.elements[2].type).toBe("Control")
    expect(uiSchema.elements[2].options.detail.type).toBe("VerticalLayout")
  })

  it("adds childLabelProp for timeline steps", function () {
    const uiSchema = getBlockUiSchema("timeline")
    const steps = uiSchema.elements[2]
    expect(steps.options.childLabelProp).toBe("date")
  })
})
