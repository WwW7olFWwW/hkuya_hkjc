import { render, screen, fireEvent, cleanup } from "@testing-library/vue"
import { describe, it, expect, afterEach, beforeEach, vi } from "vitest"
import ContentEditor from "../../components/admin/ContentEditor.vue"

const saveFormSchema = vi.hoisted(function () {
  return vi.fn()
})
const buildAllFormioSchemasFromDefault = vi.hoisted(function () {
  return vi.fn()
})
const fetchAllFormSchemas = vi.hoisted(function () {
  return vi.fn()
})

vi.mock("../../lib/formio/schemaStore", function () {
  return {
    saveFormSchema: saveFormSchema,
    fetchAllFormSchemas: fetchAllFormSchemas
  }
})

vi.mock("../../lib/formio/schemaGenerator", function () {
  return {
    buildAllFormioSchemasFromDefault: buildAllFormioSchemasFromDefault
  }
})

function setConfirmResult(result: boolean) {
  const windowRecord = window as unknown as Record<string, unknown>
  const originalConfirm = windowRecord.confirm
  const confirmSpy = vi.fn()
  confirmSpy.mockReturnValue(result)
  windowRecord.confirm = confirmSpy
  return function restoreConfirm() {
    if (typeof originalConfirm === "undefined") {
      delete windowRecord.confirm
    } else {
      windowRecord.confirm = originalConfirm
    }
  }
}

describe("ContentEditor Formio entry", function () {
  beforeEach(function () {
    saveFormSchema.mockReset()
    buildAllFormioSchemasFromDefault.mockReset()
    fetchAllFormSchemas.mockReset()
  })

  afterEach(function () {
    cleanup()
  })

  it("shows editor view by default", async function () {
    render(ContentEditor, {
      global: {
        stubs: {
          FormioBuilder: {
            name: "FormioBuilder",
            props: ["slug"],
            template: "<div>BuilderStub</div>"
          },
          FormioEditor: {
            name: "FormioEditor",
            props: ["slug"],
            template: "<div>EditorStub</div>"
          }
        }
      }
    })

    expect(await screen.findByText("EditorStub")).toBeTruthy()
  })

  it("toggles to builder view", async function () {
    render(ContentEditor, {
      global: {
        stubs: {
          FormioBuilder: {
            name: "FormioBuilder",
            props: ["slug"],
            template: "<div>BuilderStub</div>"
          },
          FormioEditor: {
            name: "FormioEditor",
            props: ["slug"],
            template: "<div>EditorStub</div>"
          }
        }
      }
    })

    await fireEvent.click(screen.getByText("Schema Builder"))

    expect(await screen.findByText("BuilderStub")).toBeTruthy()
  })

  it("batch generates schemas", async function () {
    buildAllFormioSchemasFromDefault.mockReturnValue([
      { slug: "project_intro", schema: { components: [] } },
      { slug: "timeline", schema: { components: [] } }
    ])
    saveFormSchema.mockResolvedValue(undefined)

    const restoreConfirm = setConfirmResult(true)

    render(ContentEditor, {
      global: {
        stubs: {
          FormioBuilder: {
            name: "FormioBuilder",
            props: ["slug"],
            template: "<div>BuilderStub</div>"
          },
          FormioEditor: {
            name: "FormioEditor",
            props: ["slug"],
            template: "<div>EditorStub</div>"
          }
        }
      }
    })

    await fireEvent.click(screen.getByText("批次產生並儲存"))

    expect(saveFormSchema).toHaveBeenCalledTimes(2)
    expect(saveFormSchema.mock.calls[0][0]).toBe("project_intro")
    expect(saveFormSchema.mock.calls[1][0]).toBe("timeline")

    restoreConfirm()
  })

  it("batch generates missing schemas only", async function () {
    buildAllFormioSchemasFromDefault.mockReturnValue([
      { slug: "project_intro", schema: { components: [] } },
      { slug: "timeline", schema: { components: [] } }
    ])
    saveFormSchema.mockResolvedValue(undefined)
    fetchAllFormSchemas.mockResolvedValue([{ slug: "project_intro" }])

    const restoreConfirm = setConfirmResult(true)

    render(ContentEditor, {
      global: {
        stubs: {
          FormioBuilder: {
            name: "FormioBuilder",
            props: ["slug"],
            template: "<div>BuilderStub</div>"
          },
          FormioEditor: {
            name: "FormioEditor",
            props: ["slug"],
            template: "<div>EditorStub</div>"
          }
        }
      }
    })

    await fireEvent.click(screen.getByText("只建立缺少的"))

    expect(saveFormSchema).toHaveBeenCalledTimes(1)
    expect(saveFormSchema.mock.calls[0][0]).toBe("timeline")

    restoreConfirm()
  })
})
