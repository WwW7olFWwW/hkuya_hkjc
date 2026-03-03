import { render } from "@testing-library/vue"
import { afterEach, describe, expect, it } from "vitest"
import NavBar from "../../components/navigation/NavBar.vue"
import { defaultContent } from "../../lib/content/defaultContent"
import { useContentStore } from "../../lib/content/store"

function buildContentWithLogoHeight(height: number) {
  const cloned = JSON.parse(JSON.stringify(defaultContent)) as typeof defaultContent
  cloned.site_settings.fields.logoHeight = height
  return cloned
}

function buildContentWithHeaderLinks() {
  const cloned = JSON.parse(JSON.stringify(defaultContent)) as typeof defaultContent
  const siteSettingsFields = cloned.site_settings.fields as Record<string, unknown>
  siteSettingsFields.headerLinks = [
    {
      titleZh: "內頁管理",
      titleEn: "Admin",
      href: "/admin.html",
      primary: true
    },
    {
      titleZh: "聯絡我們",
      titleEn: "Contact",
      href: "#contactus",
      primary: false
    }
  ]
  return cloned
}

afterEach(function () {
  const store = useContentStore()
  store.contentState.value = JSON.parse(JSON.stringify(defaultContent))
})

describe("NavBar", function () {
  it("renders desktop and mobile containers", function () {
    const { container } = render(NavBar)

    const desktop = container.querySelector(".nav-desktop")
    const mobile = container.querySelector(".nav-mobile")

    expect(desktop).toBeTruthy()
    expect(mobile).toBeTruthy()
  })

  it("applies logo height from site_settings", function () {
    const store = useContentStore()
    store.contentState.value = buildContentWithLogoHeight(64)

    const { container } = render(NavBar)
    const logo = container.querySelector("img")
    const style = logo ? logo.getAttribute("style") || "" : ""

    expect(logo).toBeTruthy()
    expect(style).toContain("height: 64px")
  })

  it("uses header links from site_settings", function () {
    const store = useContentStore()
    store.contentState.value = buildContentWithHeaderLinks()

    const { container } = render(NavBar)
    const links = container.querySelectorAll('a[href="/admin.html"]')

    expect(links.length).toBeGreaterThan(0)
    expect(container.textContent || "").toContain("內頁管理")
    expect(container.textContent || "").toContain("Admin")
  })

  it("does not render primary highlight classes", function () {
    const store = useContentStore()
    store.contentState.value = buildContentWithHeaderLinks()

    const { container } = render(NavBar)

    expect(container.querySelector(".nav-link--primary")).toBeNull()
    expect(container.querySelector(".mobile-cta")).toBeNull()
  })
})
