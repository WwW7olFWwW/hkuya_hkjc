import { createSSRApp } from "vue"
import { describe, it, expect, vi, afterEach } from "vitest"
import { renderToString } from "vue/server-renderer"

vi.mock("vitepress", function () {
  return {
    withBase: function (path: string) {
      return path
    },
    useData: function () {
      return {
        page: {
          value: {
            relativePath: "index.md"
          }
        }
      }
    },
    Content: {
      template: "<div>ContentStub</div>"
    }
  }
})

function collectHydrationMessages(messages: string[], args: unknown[]) {
  const parts: string[] = []
  for (const value of args) {
    parts.push(String(value))
  }
  messages.push(parts.join(" "))
}

afterEach(function () {
  vi.restoreAllMocks()
  vi.resetModules()
  document.body.innerHTML = ""
})

describe("Theme layout hydration", function () {
  it("does not report mismatch during hydration", async function () {
    const module = await import("../../.vitepress/theme/Layout.vue")
    const Layout = module.default

    const ssrHtml = await renderToString(createSSRApp(Layout))
    const container = document.createElement("div")
    container.innerHTML = ssrHtml
    document.body.appendChild(container)

    const messages: string[] = []
    vi.spyOn(console, "warn").mockImplementation(function (...args: unknown[]) {
      collectHydrationMessages(messages, args)
    })
    vi.spyOn(console, "error").mockImplementation(function (...args: unknown[]) {
      collectHydrationMessages(messages, args)
    })

    createSSRApp(Layout).mount(container, true)

    let hasMismatchWarning = false
    for (const message of messages) {
      if (message.includes("contains mismatches")) {
        hasMismatchWarning = true
      }
    }

    expect(hasMismatchWarning).toBe(false)
  }, 20000)
})
