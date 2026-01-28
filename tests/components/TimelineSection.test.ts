import { render, screen } from "@testing-library/vue"
import { describe, it, expect } from "vitest"
import TimelineSection from "../../components/sections/TimelineSection.vue"

function buildContent() {
  return {
    fields: {
      titleZh: "測試時間表",
      titleEn: "Timeline",
      steps: [
        {
          date: "2025-01",
          content: ["步驟內容"],
          highlight: true
        }
      ],
      notes: [
        {
          icon: "money",
          title: "測試備註",
          content: ["備註內容"]
        }
      ]
    }
  }
}

describe("TimelineSection", function () {
  it("renders steps and notes from content", function () {
    render(TimelineSection, {
      props: {
        content: buildContent()
      }
    })

    expect(screen.getByText(/測試時間表/)).toBeTruthy()
    expect(screen.getByText("2025-01")).toBeTruthy()
    expect(screen.getByText("步驟內容")).toBeTruthy()
    expect(screen.getByText("測試備註")).toBeTruthy()
  })
})
