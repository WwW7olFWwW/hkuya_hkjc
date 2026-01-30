import { render, screen, cleanup } from "@testing-library/vue"
import { describe, it, expect, afterEach } from "vitest"
import ContactSection from "../../components/sections/ContactSection.vue"

function buildContent() {
  return {
    fields: {
      titleZh: "聯絡我們測試",
      titleEn: "Contact Test",
      email: "test@example.com",
      tel: "1234 5678"
    }
  }
}

describe("ContactSection", function () {
  afterEach(function () {
    cleanup()
  })

  it("renders title from content", function () {
    render(ContactSection, {
      props: {
        content: buildContent()
      }
    })

    expect(screen.getByText(/聯絡我們測試/)).toBeTruthy()
    expect(screen.getByText(/Contact Test/)).toBeTruthy()
  })

  it("renders email and tel from content", function () {
    render(ContactSection, {
      props: {
        content: buildContent()
      }
    })

    expect(screen.getByText(/test@example.com/)).toBeTruthy()
    expect(screen.getByText(/1234 5678/)).toBeTruthy()
  })
})
