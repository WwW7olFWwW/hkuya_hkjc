import { describe, it, expect } from "vitest"
import { applyContentUpdate } from "../../lib/content/realtime"
import { defaultContent } from "../../lib/content/defaultContent"

describe("applyContentUpdate", function () {
  it("replaces block fields and keeps other defaults", function () {
    const payload = {
      new: { slug: "project_intro", fields: { titleZh: "更新標題" } }
    }

    const output = applyContentUpdate(defaultContent, payload)

    expect(output.project_intro.fields.titleZh).toBe("更新標題")
    expect(output.timeline).toEqual(defaultContent.timeline)
  })
})
