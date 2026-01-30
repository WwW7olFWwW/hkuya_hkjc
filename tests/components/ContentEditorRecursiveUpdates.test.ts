import { render, screen } from "@testing-library/vue"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import ContentEditor from "../../components/admin/ContentEditor.vue"

const select = vi.hoisted(function () {
  return vi.fn()
})
const upsert = vi.hoisted(function () {
  return vi.fn()
})
const from = vi.hoisted(function () {
  return vi.fn()
})

vi.mock("../../lib/supabase/client", function () {
  return {
    supabase: {
      from: from
    }
  }
})

vi.mock("@jsonforms/vue", function () {
  return {
    JsonForms: {
      name: "JsonForms",
      props: ["data", "schema", "uischema", "renderers"],
      emits: ["change"],
      mounted: function () {
        this.$emit("change", { data: this.data })
      },
      updated: function () {
        this.$emit("change", { data: this.data })
      },
      template: "<div data-testid=\"jsonforms\" />"
    }
  }
})

beforeEach(function () {
  select.mockReset()
  upsert.mockReset()
  from.mockReset()

  from.mockImplementation(function () {
    return {
      select: select,
      upsert: upsert
    }
  })

  select.mockResolvedValue({
    data: [
      {
        slug: "project_intro",
        fields: { titleZh: "更新標題" }
      }
    ]
  })
})

afterEach(function () {
  document.body.innerHTML = ""
})

describe("ContentEditor JSON Forms", function () {
  it("renders without recursive updates when JsonForms emits on mount", async function () {
    render(ContentEditor)

    await screen.findByText("project_intro")

    expect(screen.getByText("project_intro")).toBeTruthy()
  })
})
