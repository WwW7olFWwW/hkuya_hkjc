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

  it("wraps single line string into array when template is string array", function () {
    const template = {
      duties: [""]
    }

    const result = mapSubmissionToContent({ duties: "single line" }, template)

    expect(result.duties).toEqual(["single line"])
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

  it("extracts image url from file component submission for string template", function () {
    const template = {
      logo: ""
    }

    const result = mapSubmissionToContent(
      {
        logo: [
          {
            name: "logo.png",
            type: "image/png",
            url: "data:image/png;base64,abc123"
          }
        ]
      },
      template
    )

    expect(result.logo).toBe("data:image/png;base64,abc123")
  })

  it("falls back to template image path when extracted url is bare filename", function () {
    const template = {
      logo: "/images/logo.png"
    }

    const result = mapSubmissionToContent(
      {
        logo: [
          {
            name: "logo.png",
            type: "image/png",
            url: "logo.png"
          }
        ]
      },
      template
    )

    expect(result.logo).toBe("/images/logo.png")
  })

  it("prefers base64 data over bare filename url", function () {
    const template = {
      logo: "/images/logo.png"
    }

    const result = mapSubmissionToContent(
      {
        logo: [
          {
            name: "logo.png",
            type: "image/png",
            url: "logo.png",
            data: "abc123"
          }
        ]
      },
      template
    )

    expect(result.logo).toBe("data:image/png;base64,abc123")
  })

  it("maps base-prefixed local url back to template path", function () {
    const template = {
      logo: "/images/logo.png"
    }

    const result = mapSubmissionToContent(
      {
        logo: [
          {
            name: "logo.png",
            type: "image/png",
            url: "/hkjc/images/logo.png"
          }
        ]
      },
      template
    )

    expect(result.logo).toBe("/images/logo.png")
  })

  it("uses the latest uploaded file when multiple file records exist", function () {
    const template = {
      logo: "/images/logo.png"
    }

    const result = mapSubmissionToContent(
      {
        logo: [
          {
            name: "old-logo.png",
            type: "image/png",
            url: "/images/logo.png"
          },
          {
            name: "new-logo.webp",
            type: "image/webp",
            url: "data:image/webp;base64,newData"
          }
        ]
      },
      template
    )

    expect(result.logo).toBe("data:image/webp;base64,newData")
  })
})
