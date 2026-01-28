import { render, screen } from "@testing-library/vue"
import { describe, it, expect } from "vitest"
import InterviewSection from "../../components/sections/InterviewSection.vue"

function buildContent() {
  return {
    fields: {
      titleZh: "面試標題",
      titleEn: "Interview",
      descriptionZh: "中文說明",
      descriptionEn: "English description"
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
  })
})
