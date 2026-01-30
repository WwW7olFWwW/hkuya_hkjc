import type { JsonSchema, UISchemaElement } from "@jsonforms/core"
import { defaultContent } from "./defaultContent"

type SchemaEntry = {
  schema: JsonSchema
  uischema: UISchemaElement
}

type BlockSchemas = Record<string, SchemaEntry>

type GenericBlock = {
  fields: Record<string, unknown>
}

function buildStringArraySchema() {
  return {
    type: "array",
    items: { type: "string" }
  }
}

function buildTimelineSchema(): SchemaEntry {
  return {
    schema: {
      type: "object",
      properties: {
        titleZh: { type: "string" },
        titleEn: { type: "string" },
        steps: {
          type: "array",
          items: {
            type: "object",
            properties: {
              date: { type: "string" },
              content: buildStringArraySchema(),
              highlight: { type: "boolean" }
            }
          }
        },
        notes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              icon: { type: "string" },
              title: { type: "string" },
              content: buildStringArraySchema()
            }
          }
        }
      }
    },
    uischema: {
      type: "VerticalLayout",
      elements: [
        { type: "Control", scope: "#/properties/titleZh" },
        { type: "Control", scope: "#/properties/titleEn" },
        {
          type: "Control",
          scope: "#/properties/steps",
          options: {
            childLabelProp: "date",
            detail: {
              type: "VerticalLayout",
              elements: [
                { type: "Control", scope: "#/properties/date" },
                { type: "Control", scope: "#/properties/content" },
                { type: "Control", scope: "#/properties/highlight" }
              ]
            }
          }
        },
        {
          type: "Control",
          scope: "#/properties/notes",
          options: {
            childLabelProp: "title",
            detail: {
              type: "VerticalLayout",
              elements: [
                { type: "Control", scope: "#/properties/icon" },
                { type: "Control", scope: "#/properties/title" },
                { type: "Control", scope: "#/properties/content" }
              ]
            }
          }
        }
      ]
    }
  }
}

function buildPositionsSchema(): SchemaEntry {
  return {
    schema: {
      type: "object",
      properties: {
        titleZh: { type: "string" },
        titleEn: { type: "string" },
        groups: {
          type: "array",
          items: {
            type: "object",
            properties: {
              location: { type: "string" },
              description: { type: "string" },
              positions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    companyLines: buildStringArraySchema(),
                    roleLines: buildStringArraySchema(),
                    requirements: buildStringArraySchema(),
                    duties: buildStringArraySchema()
                  }
                }
              }
            }
          }
        }
      }
    },
    uischema: {
      type: "VerticalLayout",
      elements: [
        { type: "Control", scope: "#/properties/titleZh" },
        { type: "Control", scope: "#/properties/titleEn" },
        {
          type: "Control",
          scope: "#/properties/groups",
          options: {
            childLabelProp: "location",
            detail: {
              type: "VerticalLayout",
              elements: [
                { type: "Control", scope: "#/properties/location" },
                { type: "Control", scope: "#/properties/description" },
                {
                  type: "Control",
                  scope: "#/properties/positions",
                  options: {
                    childLabelProp: "companyLines",
                    detail: {
                      type: "VerticalLayout",
                      elements: [
                        { type: "Control", scope: "#/properties/companyLines" },
                        { type: "Control", scope: "#/properties/roleLines" },
                        { type: "Control", scope: "#/properties/requirements" },
                        { type: "Control", scope: "#/properties/duties" }
                      ]
                    }
                  }
                }
              ]
            }
          }
        }
      ]
    }
  }
}

function buildAboutUsSchema(): SchemaEntry {
  return {
    schema: {
      type: "object",
      properties: {
        titleZh: { type: "string" },
        titleEn: { type: "string" },
        organizations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              role: { type: "string" },
              name: { type: "string" },
              logo: { type: "string" },
              url: { type: "string" }
            }
          }
        }
      }
    },
    uischema: {
      type: "VerticalLayout",
      elements: [
        { type: "Control", scope: "#/properties/titleZh" },
        { type: "Control", scope: "#/properties/titleEn" },
        {
          type: "Control",
          scope: "#/properties/organizations",
          options: {
            childLabelProp: "role",
            detail: {
              type: "VerticalLayout",
              elements: [
                { type: "Control", scope: "#/properties/role" },
                { type: "Control", scope: "#/properties/name" },
                { type: "Control", scope: "#/properties/logo" },
                { type: "Control", scope: "#/properties/url" }
              ]
            }
          }
        }
      ]
    }
  }
}

function buildContactSchema(): SchemaEntry {
  return {
    schema: {
      type: "object",
      properties: {
        titleZh: { type: "string" },
        titleEn: { type: "string" },
        email: { type: "string" },
        tel: { type: "string" }
      }
    },
    uischema: {
      type: "VerticalLayout",
      elements: [
        { type: "Control", scope: "#/properties/titleZh" },
        { type: "Control", scope: "#/properties/titleEn" },
        { type: "Control", scope: "#/properties/email" },
        { type: "Control", scope: "#/properties/tel" }
      ]
    }
  }
}

function buildGenericSchema(slug: string): SchemaEntry {
  const block = defaultContent[slug as keyof typeof defaultContent] as GenericBlock | undefined
  const fields = block ? block.fields : {}
  const properties: Record<string, JsonSchema> = {}
  const elements: UISchemaElement[] = []

  for (const key of Object.keys(fields)) {
    const value = fields[key]
    if (Array.isArray(value)) {
      properties[key] = buildStringArraySchema()
    } else {
      properties[key] = { type: "string" }
    }
    elements.push({ type: "Control", scope: "#/properties/" + key })
  }

  return {
    schema: {
      type: "object",
      properties: properties
    },
    uischema: {
      type: "VerticalLayout",
      elements: elements
    }
  }
}

const blockSchemas: BlockSchemas = {
  timeline: buildTimelineSchema(),
  positions: buildPositionsSchema(),
  about_us: buildAboutUsSchema(),
  contact: buildContactSchema()
}

export function getBlockSchema(slug: string) {
  if (blockSchemas[slug]) {
    return blockSchemas[slug].schema
  }
  return buildGenericSchema(slug).schema
}

export function getBlockUiSchema(slug: string) {
  if (blockSchemas[slug]) {
    return blockSchemas[slug].uischema
  }
  return buildGenericSchema(slug).uischema
}
