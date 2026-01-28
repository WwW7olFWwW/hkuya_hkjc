import { render, screen } from "@testing-library/vue"
import { describe, it, expect } from "vitest"
import ContactSection from "../../components/sections/ContactSection.vue"

function buildContent() {
  return {
    fields: {
      titleZh: "聯絡我們測試",
      titleEn: "Contact Test"
    }
  }
}

describe("ContactSection", function () {
  it("renders title from content", function () {
    render(ContactSection, {
      props: {
        content: buildContent()
      }
    })

    expect(screen.getByText(/聯絡我們測試/)).toBeTruthy()
    expect(screen.getByText(/Contact Test/)).toBeTruthy()
  })
})
