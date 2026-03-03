import { createSSRApp } from "vue"
import { describe, it, expect, vi, afterEach } from "vitest"
import { renderToString } from "vue/server-renderer"
import AdminPage from "../../components/admin/AdminPage.vue"

function collectHydrationMessages(messages: string[], args: unknown[]) {
  const parts: string[] = []
  for (const value of args) {
    parts.push(String(value))
  }
  messages.push(parts.join(" "))
}

afterEach(function () {
  vi.restoreAllMocks()
  document.body.innerHTML = ""
})

describe("AdminPage hydration", function () {
  it("does not server-render login inputs", async function () {
    const ssrHtml = await renderToString(createSSRApp(AdminPage))

    expect(ssrHtml.includes("admin-email")).toBe(false)
    expect(ssrHtml.includes("admin-password")).toBe(false)
  })

  it("does not report mismatch when login inputs are prefilled", async function () {
    const ssrHtml = await renderToString(createSSRApp(AdminPage))
    const container = document.createElement("div")
    container.innerHTML = ssrHtml
    document.body.appendChild(container)

    const emailInput = container.querySelector("#admin-email") as HTMLInputElement | null
    const passwordInput = container.querySelector("#admin-password") as HTMLInputElement | null
    if (emailInput) {
      emailInput.value = "autofill@example.com"
    }
    if (passwordInput) {
      passwordInput.value = "autofill-password"
    }

    const messages: string[] = []
    vi.spyOn(console, "warn").mockImplementation(function (...args: unknown[]) {
      collectHydrationMessages(messages, args)
    })
    vi.spyOn(console, "error").mockImplementation(function (...args: unknown[]) {
      collectHydrationMessages(messages, args)
    })

    createSSRApp(AdminPage).mount(container, true)

    let hasMismatchWarning = false
    for (const message of messages) {
      if (message.includes("contains mismatches")) {
        hasMismatchWarning = true
      }
    }

    expect(hasMismatchWarning).toBe(false)
  })
})
