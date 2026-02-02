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
})
