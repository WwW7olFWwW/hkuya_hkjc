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
      template: "<div data-testid=\"jsonforms-stub\"></div>"
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

  upsert.mockResolvedValue({ error: null })
})

afterEach(function () {
  document.body.innerHTML = ""
})

describe("ContentEditor JSON Forms", function () {
  it("renders json forms for blocks", async function () {
    render(ContentEditor)

    expect(await screen.findByText("project_intro")).toBeTruthy()
    expect(await screen.findByTestId("jsonforms-stub")).toBeTruthy()
  })
})
