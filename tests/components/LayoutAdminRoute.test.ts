import { render } from "@testing-library/vue"
import { describe, it, expect, vi } from "vitest"

vi.mock("vitepress", function () {
  return {
    withBase: function (path: string) {
      return path
    },
    useData: function () {
      return {
        page: {
          value: {
            relativePath: "admin.md"
          }
        }
      }
    },
    Content: {
      template: "<div>AdminContentStub</div>"
    }
  }
})

import Layout from "../../.vitepress/theme/Layout.vue"

describe("Theme layout admin route", function () {
  it("does not render global nav and footer on admin route", function () {
    const { container } = render(Layout)

    expect(container.querySelector(".site-header")).toBeNull()
    expect(container.querySelector("footer")).toBeNull()
    expect(container.textContent || "").toContain("AdminContentStub")
  })
})
