import { render, screen, fireEvent, cleanup } from "@testing-library/vue"
import { describe, it, expect, afterEach } from "vitest"
import ContentEditor from "../../components/admin/ContentEditor.vue"

describe("ContentEditor Formio entry", function () {
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
})
