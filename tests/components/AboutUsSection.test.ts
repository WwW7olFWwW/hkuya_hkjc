import { render, screen, cleanup } from "@testing-library/vue"
import { describe, it, expect, afterEach } from "vitest"
import AboutUsSection from "../../components/sections/AboutUsSection.vue"

function buildContent() {
  return {
    fields: {
      titleZh: "關於我們測試",
      titleEn: "About Us Test",
      organizations: [
        {
          role: "主辦單位",
          name: "測試單位",
          logo: "/images/logo.png",
          url: "https://example.com"
        }
      ]
    }
  }
}

describe("AboutUsSection", function () {
  afterEach(function () {
    cleanup()
  })

  it("renders title from content", function () {
    render(AboutUsSection, {
      props: {
        content: buildContent()
      }
    })

    expect(screen.getByText(/關於我們測試/)).toBeTruthy()
    expect(screen.getByText(/About Us Test/)).toBeTruthy()
  })

  it("renders organizations from content", function () {
    render(AboutUsSection, {
      props: {
        content: buildContent()
      }
    })

    expect(screen.getByText("主辦單位")).toBeTruthy()
    expect(screen.getByText("測試單位")).toBeTruthy()
  })
})
