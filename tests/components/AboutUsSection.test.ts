import { render, screen } from "@testing-library/vue"
import { describe, it, expect } from "vitest"
import AboutUsSection from "../../components/sections/AboutUsSection.vue"

function buildContent() {
  return {
    fields: {
      titleZh: "關於我們測試",
      titleEn: "About Us Test"
    }
  }
}

describe("AboutUsSection", function () {
  it("renders title from content", function () {
    render(AboutUsSection, {
      props: {
        content: buildContent()
      }
    })

    expect(screen.getByText(/關於我們測試/)).toBeTruthy()
    expect(screen.getByText(/About Us Test/)).toBeTruthy()
  })
})
