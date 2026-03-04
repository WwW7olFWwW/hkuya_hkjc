import { describe, it, expect, vi } from "vitest"
import { mount } from "@vue/test-utils"
import ProjectIntroEditor from "../../../components/admin/editors/ProjectIntroEditor.vue"

vi.mock("@/lib/admin/usePocketBaseContent", function () {
  return {
    usePocketBaseContent: vi.fn(function () {
      return {
        state: {
          value: {
            fields: { infoCards: [] },
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

describe("ProjectIntroEditor", function () {
  it("renders editor title", function () {
    const wrapper = mount(ProjectIntroEditor)
    expect(wrapper.text()).toContain("項目簡介編輯")
  })
})
