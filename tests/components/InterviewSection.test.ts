import { render, screen } from "@testing-library/vue"
import { describe, it, expect } from "vitest"
import InterviewSection from "../../components/sections/InterviewSection.vue"

function buildContent() {
  return {
    fields: {
      titleZh: "面試標題",
      titleEn: "Interview",
      descriptionZh: "中文說明",
      descriptionEn: "English description",
      firstRoundLabel: "第一輪面試日期 First Round Interview Date",
      firstRoundDate: "1 April 2026",
      secondRoundLabel: "第二輪面試日期 Second Round Interview Date",
      secondRoundDate: "15 April 2026"
    }
  }
}

describe("InterviewSection", function () {
  it("renders interview content", function () {
    render(InterviewSection, {
      props: {
        content: buildContent()
      }
    })

    expect(screen.getByText(/面試標題/)).toBeTruthy()
    expect(screen.getByText("中文說明")).toBeTruthy()
    expect(screen.getByText("English description")).toBeTruthy()
    expect(screen.getByText("第一輪面試日期")).toBeTruthy()
    expect(screen.getByText("First Round Interview Date")).toBeTruthy()
    expect(screen.getByText("1 April 2026")).toBeTruthy()
    expect(screen.getByText("第二輪面試日期")).toBeTruthy()
    expect(screen.getByText("Second Round Interview Date")).toBeTruthy()
    expect(screen.getByText("15 April 2026")).toBeTruthy()
  })
})
