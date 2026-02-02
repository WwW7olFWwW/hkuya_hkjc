import { describe, it, expect } from "vitest"
import { buildFormioSchemaFromDefault } from "../../lib/formio/schemaGenerator"

type Component = {
  key?: string
  type?: string
  inlineEdit?: boolean
  openWhenEmpty?: boolean
  validate?: {
    min?: number
    max?: number
    step?: number
  }
  components?: Component[]
}

function findComponentByKey(components: Component[], key: string): Component | null {
  for (const component of components) {
    if (component.key === key) {
      return component
    }
    if (component.components && component.components.length > 0) {
      const found = findComponentByKey(component.components, key)
      if (found) {
        return found
      }
    }
  }
  return null
}

describe("buildFormioSchemaFromDefault", function () {
  it("builds editgrid structure for positions", function () {
    const schema = buildFormioSchemaFromDefault("positions")
    const components = schema.components as Component[]
    const groups = findComponentByKey(components, "groups")
    expect(groups && groups.type).toBe("editgrid")
    expect(groups && groups.inlineEdit).toBe(true)
    expect(groups && groups.openWhenEmpty).toBe(true)

    const groupComponents = (groups && groups.components ? groups.components : []) as Component[]
    const positions = findComponentByKey(groupComponents, "positions")
    expect(positions && positions.type).toBe("editgrid")
    expect(positions && positions.inlineEdit).toBe(true)
    expect(positions && positions.openWhenEmpty).toBe(true)

    const positionsComponents = (positions && positions.components ? positions.components : []) as Component[]
    const duties = findComponentByKey(positionsComponents, "duties")
    expect(duties && duties.type).toBe("textarea")
  })

  it("builds site_settings logoHeight as number", function () {
    const schema = buildFormioSchemaFromDefault("site_settings")
    const components = schema.components as Component[]
    const logoHeight = findComponentByKey(components, "logoHeight")
    expect(logoHeight && logoHeight.type).toBe("number")
    expect(logoHeight && logoHeight.validate && logoHeight.validate.min).toBe(32)
    expect(logoHeight && logoHeight.validate && logoHeight.validate.max).toBe(96)
    expect(logoHeight && logoHeight.validate && logoHeight.validate.step).toBe(1)
  })
})
