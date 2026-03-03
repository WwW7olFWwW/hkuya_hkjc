import { describe, it, expect } from "vitest"
import { normalizeContent } from "../../lib/content/normalizeContent"
import { defaultContent } from "../../lib/content/defaultContent"

describe("normalizeContent", function () {
  it("fills missing blocks from defaults", function () {
    const input = {
      project_intro: { fields: { titleZh: "更新標題" } }
    }

    const output = normalizeContent(input)

    expect(output.project_intro.fields.titleZh).toBe("更新標題")
    expect(output.timeline).toEqual(defaultContent.timeline)
  })

  it("fills project_intro posterUrl and infoCards from defaults", function () {
    const input = {
      project_intro: { fields: { titleZh: "更新標題" } }
    }

    const output = normalizeContent(input)

    expect(output.project_intro.fields.titleZh).toBe("更新標題")
    expect(typeof output.project_intro.fields.posterUrl).toBe("string")
    expect(Array.isArray(output.project_intro.fields.infoCards)).toBe(true)
  })

  it("fills site_settings from defaults", function () {
    const input = {
      project_intro: { fields: { titleZh: "更新標題" } }
    }

    const output = normalizeContent(input)

    expect(output.site_settings).toBeTruthy()
    expect(output.site_settings.fields.logoHeight).toBe(48)
  })

  it("normalizes bare project_intro poster filename to /images path", function () {
    const input = {
      project_intro: { fields: { posterUrl: "poster.webp" } }
    }

    const output = normalizeContent(input)
    expect(output.project_intro.fields.posterUrl).toBe("/images/poster.webp")
  })

  it("normalizes bare about_us logo filename to /images path", function () {
    const input = {
      about_us: {
        fields: {
          organizations: [
            {
              role: "主辦單位",
              name: "測試單位",
              logo: "logo.png",
              url: ""
            }
          ]
        }
      }
    }

    const output = normalizeContent(input)
    const organizations = output.about_us.fields.organizations as Array<Record<string, unknown>>
    expect(organizations[0].logo).toBe("/images/logo.png")
  })

  it("normalizes timeline string content fields into arrays", function () {
    const input = {
      timeline: {
        fields: {
          steps: [
            {
              date: "March 2025",
              content: "宣傳推廣",
              highlight: true
            }
          ],
          notes: [
            {
              icon: "money",
              title: "薪金 salary",
              content: "不提供薪金"
            }
          ]
        }
      }
    }

    const output = normalizeContent(input)
    const steps = output.timeline.fields.steps as Array<Record<string, unknown>>
    const notes = output.timeline.fields.notes as Array<Record<string, unknown>>

    expect(steps[0].content).toEqual(["宣傳推廣"])
    expect(notes[0].content).toEqual(["不提供薪金"])
  })

  it("fixes broken character arrays in positions titleEn", function () {
    const input = {
      positions: {
        fields: {
          titleZh: "實習崗位",
          titleEn: ["J", "o", "b", " ", "P", "o", "s", "i", "t", "i", "o", "n", "s"]
        }
      }
    }

    const output = normalizeContent(input)
    expect(output.positions.fields.titleEn).toBe("Job Positions")
  })

  it("fixes broken character arrays in positions companyLines", function () {
    const input = {
      positions: {
        fields: {
          titleZh: "實習崗位",
          titleEn: "Job Positions",
          groups: [
            {
              location: "北京",
              description: "測試",
              positions: [
                {
                  companyLines: [
                    ["中", "國", "科", "學", "院", "生", "態", "環", "境", "研", "究", "中", "心"],
                    "Chinese Academy of Sciences"
                  ],
                  roleLines: ["科研實習崗"],
                  requirements: ["有相關專業學術背景"],
                  duties: ["參加研究項目"]
                }
              ]
            }
          ]
        }
      }
    }

    const output = normalizeContent(input)
    const groups = output.positions.fields.groups as Array<Record<string, unknown>>
    const positions = groups[0].positions as Array<Record<string, unknown>>
    const companyLines = positions[0].companyLines as string[]

    expect(companyLines[0]).toBe("中國科學院生態環境研究中心")
    expect(companyLines[1]).toBe("Chinese Academy of Sciences")
  })

  it("converts string companyLines to array by splitting on newlines", function () {
    const input = {
      positions: {
        fields: {
          titleZh: "實習崗位",
          titleEn: "Job Positions",
          groups: [
            {
              location: "北京",
              description: "測試",
              positions: [
                {
                  companyLines: "中國科學院生態環境研究中心\nChinese Academy of Sciences",
                  roleLines: "科研實習崗\nResearch Intern",
                  requirements: "要求一\n要求二",
                  duties: "工作一\n工作二"
                }
              ]
            }
          ]
        }
      }
    }

    const output = normalizeContent(input)
    const groups = output.positions.fields.groups as Array<Record<string, unknown>>
    const positions = groups[0].positions as Array<Record<string, unknown>>

    expect(positions[0].companyLines).toEqual(["中國科學院生態環境研究中心", "Chinese Academy of Sciences"])
    expect(positions[0].roleLines).toEqual(["科研實習崗", "Research Intern"])
    expect(positions[0].requirements).toEqual(["要求一", "要求二"])
    expect(positions[0].duties).toEqual(["工作一", "工作二"])
  })

  it("fixes broken character arrays in all position string array fields", function () {
    const input = {
      positions: {
        fields: {
          titleZh: "實習崗位",
          titleEn: "Job Positions",
          groups: [
            {
              location: ["北", "京"],
              description: ["測", "試"],
              positions: [
                {
                  companyLines: [["公", "司", "A"]],
                  roleLines: [["角", "色", "A"]],
                  requirements: [["要", "求", "一"]],
                  duties: [["工", "作", "一"]]
                }
              ]
            }
          ]
        }
      }
    }

    const output = normalizeContent(input)
    const groups = output.positions.fields.groups as Array<Record<string, unknown>>
    const positions = groups[0].positions as Array<Record<string, unknown>>

    expect(groups[0].location).toBe("北京")
    expect(groups[0].description).toBe("測試")
    expect((positions[0].companyLines as string[])[0]).toBe("公司A")
    expect((positions[0].roleLines as string[])[0]).toBe("角色A")
    expect((positions[0].requirements as string[])[0]).toBe("要求一")
    expect((positions[0].duties as string[])[0]).toBe("工作一")
  })

  it("preserves normal string arrays in positions", function () {
    const input = {
      positions: {
        fields: {
          titleZh: "實習崗位",
          titleEn: "Job Positions",
          groups: [
            {
              location: "北京",
              description: "測試"
            }
          ]
        }
      }
    }

    const output = normalizeContent(input)
    expect(output.positions.fields.titleEn).toBe("Job Positions")
    expect(Array.isArray(output.positions.fields.groups)).toBe(true)
  })
})
