import { describe, it, expect } from "vitest"
import { buildFormioSchemaFromDefault } from "../../lib/formio/schemaGenerator"

type Component = {
  key?: string
  type?: string
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

    const groupComponents = (groups && groups.components ? groups.components : []) as Component[]
    const positions = findComponentByKey(groupComponents, "positions")
    expect(positions && positions.type).toBe("editgrid")

    const positionsComponents = (positions && positions.components ? positions.components : []) as Component[]
    const duties = findComponentByKey(positionsComponents, "duties")
    expect(duties && duties.type).toBe("textarea")
  })
})
