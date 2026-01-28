import { render, screen } from "@testing-library/vue"
import { describe, it, expect } from "vitest"
import PositionsSection from "../../components/sections/PositionsSection.vue"

function buildContent() {
  return {
    fields: {
      titleZh: "測試崗位",
      titleEn: "Job Positions",
      groups: [
        {
          location: "北京",
          description: "測試說明",
          positions: [
            {
              companyLines: ["公司 A"],
              roleLines: ["角色 A"],
              requirements: ["要求一"],
              duties: ["工作一"]
            }
          ]
        }
      ]
    }
  }
}

describe("PositionsSection", function () {
  it("renders groups and positions", function () {
    render(PositionsSection, {
      props: {
        content: buildContent()
      }
    })

    expect(screen.getByText(/測試崗位/)).toBeTruthy()
    expect(screen.getByText("北京")).toBeTruthy()
    expect(screen.getByText("公司 A")).toBeTruthy()
    expect(screen.getByText("要求一")).toBeTruthy()
  })
})
