import { render, screen } from "@testing-library/vue"
import { describe, it, expect } from "vitest"
import ProjectIntro from "../../components/sections/ProjectIntro.vue"

function buildContent() {
  return {
    fields: {
      titleZh: "測試標題",
      subtitleZh: "測試副標",
      titleEn: "Test Title",
      subtitleEn: "Test Subtitle",
      descriptionZh: "中文描述",
      descriptionEn: "English description",
      posterUrl: "/images/test.png",
      infoCards: [
        {
          titleZh: "卡片一",
          titleEn: "Card One",
          contentZh: "內容一",
          contentEn: "Content One"
        },
        {
          titleZh: "卡片二",
          titleEn: "Card Two",
          contentZh: "內容二",
          contentEn: "Content Two"
        },
        {
          titleZh: "卡片三",
          titleEn: "Card Three",
          contentZh: "內容三",
          contentEn: "Content Three"
        },
        {
          titleZh: "卡片四",
          titleEn: "Card Four",
          contentZh: "內容四",
          contentEn: "Content Four"
        }
      ],
      eligibilityZh: ["資格一"],
      eligibilityEn: ["Eligibility One"],
      feeZh: ["費用一"],
      feeEn: ["Fee One"]
    }
  }
}

describe("ProjectIntro", function () {
  it("renders content fields", function () {
    render(ProjectIntro, {
      props: {
        content: buildContent()
      }
    })

    expect(screen.getByText("測試標題")).toBeTruthy()
    expect(screen.getByText("Test Title")).toBeTruthy()
    expect(screen.getByText("內容一")).toBeTruthy()
    expect(screen.getByText("Eligibility One")).toBeTruthy()
    expect(screen.getByText("Fee One")).toBeTruthy()
  })
})
