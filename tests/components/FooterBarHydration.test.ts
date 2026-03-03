import { createSSRApp } from "vue"
import { describe, it, expect, afterEach, vi } from "vitest"
import { renderToString } from "vue/server-renderer"
import { render, screen } from "@testing-library/vue"

const RealDate = Date

function setMockDate(isoString: string) {
  class MockDate extends RealDate {
    constructor(...args: any[]) {
      if (args.length === 0) {
        super(isoString)
        return
      }
      super(...args)
    }

    static now() {
      return new RealDate(isoString).getTime()
    }
  }

  globalThis.Date = MockDate as DateConstructor
}

afterEach(function () {
  globalThis.Date = RealDate
  vi.restoreAllMocks()
  vi.resetModules()
})

async function renderFooterBarSsr() {
  const module = await import("../../components/navigation/FooterBar.vue")
  return renderToString(createSSRApp(module.default))
}

describe("FooterBar hydration", function () {
  it("renders deterministic SSR markup across runtime dates", async function () {
    setMockDate("2024-06-01T12:00:00Z")
    const ssrHtmlBefore = await renderFooterBarSsr()

    vi.resetModules()
    setMockDate("2026-06-01T12:00:00Z")
    const ssrHtmlAfter = await renderFooterBarSsr()

    expect(ssrHtmlBefore).toBe(ssrHtmlAfter)
  })

  it("updates footer year on client mount", async function () {
    setMockDate("2030-01-02T08:00:00Z")
    const module = await import("../../components/navigation/FooterBar.vue")

    render(module.default)

    expect(await screen.findByText("© 2030 Hong Kong United Youth Association All rights reserved.")).toBeTruthy()
  })
})
