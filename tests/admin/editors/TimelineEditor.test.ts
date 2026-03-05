import { describe, it, expect, vi } from "vitest"
import { mount } from "@vue/test-utils"
import TimelineEditor from "../../../components/admin/editors/TimelineEditor.vue"

vi.mock("@/lib/admin/usePocketBaseContent", function () {
  return {
    usePocketBaseContent: vi.fn(function () {
      return {
        state: {
          fields: { steps: [], notes: [] },
          loading: false,
          saving: false,
          error: null,
          dirty: false
        },
        load: vi.fn(),
        save: vi.fn()
      }
    })
  }
})

describe("TimelineEditor", function () {
  it("renders editor title", function () {
    const wrapper = mount(TimelineEditor)
    expect(wrapper.text()).toContain("時間表編輯")
  })
})
