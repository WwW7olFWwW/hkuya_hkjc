import { render, screen, fireEvent } from "@testing-library/vue"
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
      template: "<button data-testid=\"jsonforms-change\" @click=\"$emit('change', { data: { titleZh: '新標題' } })\">change</button>"
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
  it("saves updated data from JsonForms", async function () {
    render(ContentEditor)

    await screen.findByText("project_intro")
    const buttons = await screen.findAllByTestId("jsonforms-change")
    await fireEvent.click(buttons[0])
    await fireEvent.click(screen.getAllByText("儲存")[0])

    expect(upsert).toHaveBeenCalled()
    const args = upsert.mock.calls[0][0]
    expect(args.fields.titleZh).toBe("新標題")
  })
})
