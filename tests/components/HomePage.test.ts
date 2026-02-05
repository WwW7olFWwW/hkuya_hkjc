import { render, screen } from "@testing-library/vue"
import { describe, it, expect, vi, afterEach } from "vitest"
import { ref } from "vue"
import HomePage from "../../components/HomePage.vue"
import { defaultContent } from "../../lib/content/defaultContent"
import * as contentStore from "../../lib/content/store"
import * as realtime from "../../lib/content/realtime"

function buildContent() {
  const cloned = JSON.parse(JSON.stringify(defaultContent))
  cloned.project_intro.fields.titleZh = "動態標題"
  return cloned
}

afterEach(function () {
  vi.restoreAllMocks()
})

describe("HomePage", function () {
  it("renders content from store", async function () {
    const contentState = ref(buildContent())
    const load = async function () {
      return
    }

    vi.spyOn(contentStore, "useContentStore").mockImplementation(function () {
      return {
        contentState: contentState,
        load: load
      }
    })

    vi.spyOn(realtime, "subscribeContentChanges").mockImplementation(function () {
      return Promise.resolve({
        unsubscribe: function () {
          return
        }
      })
    })

    render(HomePage)

    expect(await screen.findByText("動態標題")).toBeTruthy()
  })
})
