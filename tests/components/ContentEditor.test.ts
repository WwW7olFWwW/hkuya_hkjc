import { render, screen, fireEvent, cleanup } from "@testing-library/vue"
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
  cleanup()
})

describe("ContentEditor", function () {
  it("loads and renders content blocks", async function () {
    render(ContentEditor)

    expect(await screen.findByText("project_intro")).toBeTruthy()
  })

  it("saves block updates", async function () {
    render(ContentEditor)

    await screen.findByText("project_intro")
    await fireEvent.click(screen.getAllByText("儲存")[0])

    expect(await screen.findByText("已儲存：project_intro")).toBeTruthy()
  })
})
