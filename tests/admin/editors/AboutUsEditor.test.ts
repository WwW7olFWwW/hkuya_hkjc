import { describe, it, expect, vi } from "vitest"
import { mount } from "@vue/test-utils"
import AboutUsEditor from "../../../components/admin/editors/AboutUsEditor.vue"

vi.mock("@/lib/admin/usePocketBaseContent", function () {
  return {
    usePocketBaseContent: vi.fn(function () {
      return {
        state: {
          value: {
            fields: { organizations: [] },
            loading: false,
            saving: false,
            error: null,
            dirty: false
          }
        },
        load: vi.fn(),
        save: vi.fn()
      }
    })
  }
})

describe("AboutUsEditor", function () {
  it("renders editor title", function () {
    const wrapper = mount(AboutUsEditor)
    expect(wrapper.text()).toContain("關於我們編輯")
  })
})
