import { describe, it, expect } from "vitest"
import { buildFormioSchemaFromDefault } from "../../lib/formio/schemaGenerator"
import { enhanceSchemaForAdmin } from "../../lib/formio/enhanceSchemaForAdmin"

type Component = {
  key?: string
  type?: string
  label?: string
  inlineEdit?: boolean
  addAnother?: string
  input?: boolean
  storage?: string
  image?: boolean
  webcam?: boolean
  multiple?: boolean
  uploadOnly?: boolean
  filePattern?: string
  description?: string
  placeholder?: string
  rows?: unknown
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

describe("enhanceSchemaForAdmin", function () {
  it("applies user-friendly labels and editgrid behavior for positions", function () {
    const schema = buildFormioSchemaFromDefault("positions")
    const enhanced = enhanceSchemaForAdmin("positions", schema as Record<string, unknown>)

    const components = enhanced.components as Component[]
    const groups = findComponentByKey(components, "groups")
    const positions = findComponentByKey(components, "positions")

    expect(groups && groups.label).toBe("地區分組")
    expect(groups && groups.inlineEdit).toBe(false)
    expect(groups && groups.addAnother).toBe("新增地區分組")

    expect(positions && positions.label).toBe("崗位列表 Positions")
    expect(positions && positions.inlineEdit).toBe(false)
    expect(positions && positions.addAnother).toBe("新增崗位")
  })

  it("adds textarea hints for line-based fields", function () {
    const schema = buildFormioSchemaFromDefault("positions")
    const enhanced = enhanceSchemaForAdmin("positions", schema as Record<string, unknown>)
    const components = enhanced.components as Component[]
    const companyLines = findComponentByKey(components, "companyLines")

    expect(companyLines && companyLines.type).toBe("textarea")
    expect(companyLines && companyLines.description).toContain("每行一條")
    expect(companyLines && companyLines.placeholder).toContain("每行輸入一條")
    expect(companyLines && companyLines.rows).toBe(5)
  })

  it("keeps non-positions schema untouched", function () {
    const schema = buildFormioSchemaFromDefault("timeline")
    const enhanced = enhanceSchemaForAdmin("timeline", schema as Record<string, unknown>)

    expect(enhanced).toBe(schema)
  })

  it("enhances about_us logo as upload field", function () {
    const schema = buildFormioSchemaFromDefault("about_us")
    const enhanced = enhanceSchemaForAdmin("about_us", schema as Record<string, unknown>)
    const components = enhanced.components as Component[]
    const organizations = findComponentByKey(components, "organizations")
    const organizationFields = (organizations && organizations.components ? organizations.components : []) as Component[]
    const logo = findComponentByKey(organizationFields, "logo")

    expect(organizations && organizations.inlineEdit).toBe(false)
    expect(organizations && organizations.addAnother).toBe("新增機構")
    expect(logo && logo.type).toBe("file")
    expect(logo && logo.input).toBe(true)
    expect(logo && logo.storage).toBe("base64")
    expect(logo && logo.image).toBe(true)
    expect(logo && logo.webcam).toBe(false)
    expect(logo && logo.uploadOnly).toBe(false)
    expect(logo && logo.filePattern).toBe("image/*")
    expect(logo && logo.multiple).toBe(true)
    expect(logo && logo.description).toContain("上傳圖片")
  })

  it("enhances project_intro posterUrl as upload field", function () {
    const schema = buildFormioSchemaFromDefault("project_intro")
    const enhanced = enhanceSchemaForAdmin("project_intro", schema as Record<string, unknown>)
    const components = enhanced.components as Component[]
    const posterUrl = findComponentByKey(components, "posterUrl")

    expect(posterUrl && posterUrl.type).toBe("file")
    expect(posterUrl && posterUrl.input).toBe(true)
    expect(posterUrl && posterUrl.storage).toBe("base64")
    expect(posterUrl && posterUrl.image).toBe(true)
    expect(posterUrl && posterUrl.webcam).toBe(false)
    expect(posterUrl && posterUrl.uploadOnly).toBe(false)
    expect(posterUrl && posterUrl.filePattern).toBe("image/*")
    expect(posterUrl && posterUrl.multiple).toBe(true)
    expect(posterUrl && posterUrl.description).toContain("上傳圖片")
  })
})
