import { render, screen } from "@testing-library/vue"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const builder = vi.hoisted(function () {
  return vi.fn()
})

const fetchFormSchema = vi.hoisted(function () {
  return vi.fn()
})

const fetchFormHistory = vi.hoisted(function () {
  return vi.fn()
})

vi.mock("@formio/js", function () {
  return {
    Formio: {
      builder: builder
    }
  }
})

vi.mock("../../lib/formio/schemaStore", function () {
  return {
    fetchFormSchema: fetchFormSchema,
    fetchFormHistory: fetchFormHistory,
    saveFormSchema: vi.fn(),
    rollbackSchema: vi.fn()
  }
})

import FormioBuilder from "../../components/admin/FormioBuilder.vue"

describe("FormioBuilder", function () {
  beforeEach(function () {
    builder.mockReset()
    fetchFormSchema.mockReset()
    fetchFormHistory.mockReset()

    fetchFormSchema.mockResolvedValue(null)
    fetchFormHistory.mockResolvedValue([])
    builder.mockResolvedValue({ schema: { components: [] }, destroy: function () {} })
  })

  afterEach(function () {
    document.body.innerHTML = ""
  })

  it("renders builder shell", async function () {
    render(FormioBuilder, {
      props: {
        slug: "project_intro"
      }
    })

    expect(await screen.findByText("Schema Builder")).toBeTruthy()
  })
})
