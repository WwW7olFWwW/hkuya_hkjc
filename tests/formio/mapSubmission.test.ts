import { describe, it, expect } from "vitest"
import { mapSubmissionToContent } from "../../lib/formio/mapSubmission"

describe("mapSubmissionToContent", function () {
  it("converts multiline string to array when template is string array", function () {
    const template = {
      duties: [""]
    }

    const result = mapSubmissionToContent({ duties: "a\n\n b" }, template)

    expect(result.duties).toEqual(["a", "b"])
  })

  it("keeps multiline string when template is string", function () {
    const template = {
      description: ""
    }

    const result = mapSubmissionToContent({ description: "a\nb" }, template)

    expect(result.description).toBe("a\nb")
  })

  it("maps nested array objects based on template", function () {
    const template = {
      groups: [
        {
          positions: [
            {
              duties: [""]
            }
          ]
        }
      ]
    }

    const result = mapSubmissionToContent(
      {
        groups: [
          {
            positions: [
              {
                duties: "x\ny"
              }
            ]
          }
        ]
      },
      template
    )

    const groups = result.groups as Array<{ positions: Array<{ duties: string[] }> }>
    expect(groups[0].positions[0].duties).toEqual(["x", "y"])
  })
})
