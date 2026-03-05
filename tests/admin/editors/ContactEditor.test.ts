import { describe, it, expect, vi } from "vitest"
import { mount } from "@vue/test-utils"
import ContactEditor from "../../../components/admin/editors/ContactEditor.vue"

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

describe("ContactEditor", function () {
  it("renders editor title", function () {
    const wrapper = mount(ContactEditor)
    expect(wrapper.text()).toContain("聯絡方式編輯")
  })
})
