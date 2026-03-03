import { render, screen, cleanup, waitFor } from "@testing-library/vue"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const fetchFormSchema = vi.hoisted(function () {
  return vi.fn()
})
const getPocketBaseClient = vi.hoisted(function () {
  return vi.fn()
})
const createForm = vi.hoisted(function () {
  return vi.fn()
})

vi.mock("../../lib/formio/schemaStore", function () {
  return {
    fetchFormSchema: fetchFormSchema
  }
})

vi.mock("../../lib/pocketbase/client", function () {
  return {
    getPocketBaseClient: getPocketBaseClient
  }
})

vi.mock("../../lib/formio/loadFormio", function () {
  return {
    loadFormioModule: function () {
      return Promise.resolve({
        Formio: {
          createForm: createForm
        }
      })
    }
  }
})

import FormioEditor from "../../components/admin/FormioEditor.vue"

describe("FormioEditor", function () {
  beforeEach(function () {
    fetchFormSchema.mockReset()
    getPocketBaseClient.mockReset()
    getPocketBaseClient.mockReturnValue({
      collection: vi.fn()
    })
  })

  afterEach(function () {
    cleanup()
  })

  it("shows missing schema message", async function () {
    fetchFormSchema.mockResolvedValue(null)

    render(FormioEditor, {
      props: {
        slug: "project_intro"
      }
    })

    const heading = await screen.findByText("Content Editor")
    expect(heading.closest(".admin-formio")).toBeTruthy()
    expect(await screen.findByText("尚未建立 schema")).toBeTruthy()
  })

  it("normalizes about_us logo string before setting submission", async function () {
    const formInstance: Record<string, unknown> = {}
    createForm.mockResolvedValue(formInstance)

    fetchFormSchema.mockResolvedValue({
      slug: "about_us",
      schema: {
        components: []
      }
    })

    const getFirstListItem = vi.fn()
    getFirstListItem.mockResolvedValue({
      id: "record-1",
      fields: {
        organizations: [
          {
            role: "合作機構",
            name: "Test Org",
            logo: "https://example.com/logo.png",
            url: "https://example.com"
          }
        ]
      }
    })

    const collection = vi.fn()
    collection.mockReturnValue({
      getFirstListItem: getFirstListItem
    })

    getPocketBaseClient.mockReturnValue({
      collection: collection
    })

    render(FormioEditor, {
      props: {
        slug: "about_us"
      }
    })

    await waitFor(function () {
      expect(createForm).toHaveBeenCalledTimes(1)
    })

    const submission = formInstance.submission as Record<string, unknown>
    const data = submission.data as Record<string, unknown>
    const organizations = data.organizations as Array<Record<string, unknown>>
    const logo = organizations[0].logo as Array<Record<string, unknown>>

    expect(Array.isArray(logo)).toBe(true)
    expect(logo[0].url).toBe("https://example.com/logo.png")
    expect(logo[0].storage).toBe("base64")
  })
})
