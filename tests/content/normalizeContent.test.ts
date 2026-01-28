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
})
