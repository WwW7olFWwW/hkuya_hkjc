import { describe, it, expect, vi } from "vitest"
import { mount } from "@vue/test-utils"
import SiteSettingsEditor from "../../../components/admin/editors/SiteSettingsEditor.vue"

vi.mock("@/lib/admin/usePocketBaseContent", function () {
  return {
    usePocketBaseContent: vi.fn(function () {
      return {
        state: {
          fields: { headerLinks: [], footerQuickLinks: [], footerSocialLinks: [] },
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

describe("SiteSettingsEditor", function () {
  it("renders editor title", function () {
    const wrapper = mount(SiteSettingsEditor)
    expect(wrapper.text()).toContain("網站設定編輯")
  })
})
