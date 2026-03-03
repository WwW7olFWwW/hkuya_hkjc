import { render } from "@testing-library/vue"
import { afterEach, describe, expect, it } from "vitest"
import FooterBar from "../../components/navigation/FooterBar.vue"
import { defaultContent } from "../../lib/content/defaultContent"
import { useContentStore } from "../../lib/content/store"

function buildContentWithFooterLinks() {
  const cloned = JSON.parse(JSON.stringify(defaultContent)) as typeof defaultContent
  const siteSettingsFields = cloned.site_settings.fields as Record<string, unknown>
  siteSettingsFields.footerQuickLinks = [
    { label: "管理頁", href: "/admin.html", primary: true },
    { label: "聯絡", href: "#contactus", primary: false }
  ]
  siteSettingsFields.footerSocialLinks = [
    { label: "Facebook", href: "https://www.facebook.com/hongkonguya/", icon: "facebook" },
    { label: "Instagram", href: "https://www.instagram.com/hkuya_ig/", icon: "instagram" }
  ]
  return cloned
}

afterEach(function () {
  const store = useContentStore()
  store.contentState.value = JSON.parse(JSON.stringify(defaultContent))
})

describe("FooterBar", function () {
  it("uses footer links from site_settings", function () {
    const store = useContentStore()
    store.contentState.value = buildContentWithFooterLinks()

    const { container } = render(FooterBar)

    expect((container.textContent || "").indexOf("管理頁") !== -1).toBe(true)
    expect(container.querySelector('a[href="/admin.html"]')).toBeTruthy()
  })

  it("does not render primary highlight class", function () {
    const store = useContentStore()
    store.contentState.value = buildContentWithFooterLinks()

    const { container } = render(FooterBar)

    expect(container.querySelector(".footer-cta")).toBeNull()
  })
})
