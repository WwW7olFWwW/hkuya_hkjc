import { describe, it, expect, vi } from "vitest"
import { mount } from "@vue/test-utils"
import PositionsEditor from "../../../components/admin/editors/PositionsEditor.vue"

vi.mock("@/lib/admin/usePocketBaseContent", function () {
  return {
    usePocketBaseContent: vi.fn(function () {
      return {
        state: {
          value: {
            fields: { groups: [] },
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

describe("PositionsEditor", function () {
  it("renders editor title", function () {
    const wrapper = mount(PositionsEditor)
    expect(wrapper.text()).toContain("實習崗位編輯")
  })
})
