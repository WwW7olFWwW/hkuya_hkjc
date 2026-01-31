import { render, screen, cleanup } from "@testing-library/vue"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const fetchFormSchema = vi.hoisted(function () {
  return vi.fn()
})

vi.mock("../../lib/formio/schemaStore", function () {
  return {
    fetchFormSchema: fetchFormSchema
  }
})

vi.mock("../../lib/supabase/client", function () {
  return {
    supabase: {
      from: vi.fn()
    }
  }
})

import FormioEditor from "../../components/admin/FormioEditor.vue"

describe("FormioEditor", function () {
  beforeEach(function () {
    fetchFormSchema.mockReset()
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

    expect(await screen.findByText("尚未建立 schema")).toBeTruthy()
  })
})
