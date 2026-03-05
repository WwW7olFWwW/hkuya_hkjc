import { describe, it, expect } from "vitest"
import { render } from "@testing-library/vue"
import ContactSection from "../../components/sections/ContactSection.vue"
import PositionsSection from "../../components/sections/PositionsSection.vue"
import ProjectIntro from "../../components/sections/ProjectIntro.vue"
import LoadingSpinner from "../../components/ui/LoadingSpinner.vue"

describe("前端改善 E2E 測試", function() {
  describe("#3 電話號碼可點擊", function() {
    it("電話號碼應該是可點擊的 tel: 鏈接", function() {
      const { container } = render(ContactSection, {
        props: {
          content: {
            fields: {
              titleZh: "聯絡我們",
              titleEn: "Contact",
              email: "test@example.com",
              tel: "12345678"
            }
          }
        }
      })

      const telLink = container.querySelector('a[href^="tel:"]')
      expect(telLink).toBeTruthy()
      expect(telLink?.getAttribute("href")).toBe("tel:12345678")
    })
  })

  describe("#1 載入狀態優化", function() {
    it("應該顯示 LoadingSpinner 而非純文字", function() {
      const { container } = render(LoadingSpinner)
      expect(container.querySelector(".animate-spin")).toBeTruthy()
    })
  })

  describe("#5 職位詳情視覺提示", function() {
    it("details 元素應該有 group class", function() {
      const { container } = render(PositionsSection, {
        props: {
          content: {
            fields: {
              titleZh: "職位",
              titleEn: "Positions",
              groups: [{
                location: "香港",
                description: "測試",
                positions: [{
                  companyLines: ["公司"],
                  requirements: ["要求1"]
                }]
              }]
            }
          }
        }
      })

      expect(container.querySelector("details.group")).toBeTruthy()
    })
  })

  describe("#12 圖片 alt 文本優化", function() {
    it("圖片應該有描述性 alt 文本", function() {
      const { container } = render(ProjectIntro, {
        props: {
          content: {
            fields: {
              titleZh: "標題",
              subtitleZh: "副標題",
              titleEn: "Title",
              subtitleEn: "Subtitle",
              descriptionZh: "描述",
              descriptionEn: "Description",
              posterUrl: "/test.jpg",
              infoCards: [],
              eligibilityZh: [],
              eligibilityEn: [],
              feeZh: [],
              feeEn: []
            }
          }
        }
      })

      const img = container.querySelector("img")
      expect(img?.getAttribute("alt")).toContain("HKUYA HKJC")
    })
  })

  describe("#19 圖片性能優化", function() {
    it("圖片應該有 lazy loading 屬性", function() {
      const { container } = render(ProjectIntro, {
        props: {
          content: {
            fields: {
              titleZh: "標題",
              subtitleZh: "副標題",
              titleEn: "Title",
              subtitleEn: "Subtitle",
              descriptionZh: "描述",
              descriptionEn: "Description",
              posterUrl: "/test.jpg",
              infoCards: [],
              eligibilityZh: [],
              eligibilityEn: [],
              feeZh: [],
              feeEn: []
            }
          }
        }
      })

      const img = container.querySelector("img")
      expect(img?.getAttribute("loading")).toBe("lazy")
    })
  })
})
