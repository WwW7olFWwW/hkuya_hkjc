import { vi } from "vitest"

vi.mock("vitepress", function () {
  return {
    withBase: function (path: string) {
      return path
    }
  }
})
