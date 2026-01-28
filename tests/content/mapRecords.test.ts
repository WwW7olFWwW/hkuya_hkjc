import { describe, it, expect } from "vitest"
import { mapRecordsToContent } from "../../lib/content/fetchContent"

const records = [
  {
    slug: "project_intro",
    fields: { titleZh: "更新標題" }
  }
]

describe("mapRecordsToContent", function () {
  it("maps records into content map", function () {
    const content = mapRecordsToContent(records)

    expect(content.project_intro.fields.titleZh).toBe("更新標題")
  })
})
