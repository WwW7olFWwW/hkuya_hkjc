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

  it("merges default fields for timeline", async function () {
    select.mockResolvedValue({
      data: [
        {
          slug: "timeline",
          fields: { titleZh: "更新標題" }
        }
      ]
    })

    render(ContentEditor)

    const heading = await screen.findByText("timeline")
    const card = heading.closest(".section-card")
    expect(card).toBeTruthy()

    const saveButton = card ? card.querySelector("button") : null
    expect(saveButton).toBeTruthy()
    if (saveButton) {
      await fireEvent.click(saveButton)
    }

    const args = upsert.mock.calls[0][0]
    expect(args.fields.titleZh).toBe("更新標題")
    expect(Array.isArray(args.fields.steps)).toBe(true)
    expect(Array.isArray(args.fields.notes)).toBe(true)
  })
})
