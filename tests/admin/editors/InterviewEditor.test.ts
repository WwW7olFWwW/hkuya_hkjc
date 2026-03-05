import { describe, it, expect, vi } from "vitest"
import { mount } from "@vue/test-utils"
import InterviewEditor from "../../../components/admin/editors/InterviewEditor.vue"

vi.mock("@/lib/admin/usePocketBaseContent", function () {
  return {
    usePocketBaseContent: vi.fn(function () {
      return {
        state: {
          fields: {},
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

describe("InterviewEditor", function () {
  it("renders editor title", function () {
    const wrapper = mount(InterviewEditor)
    expect(wrapper.text()).toContain("面試安排編輯")
  })
})
