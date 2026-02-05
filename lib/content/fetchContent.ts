import { getPocketBaseClient } from "../pocketbase/client"
import { POCKETBASE_COLLECTIONS } from "../pocketbase/collections"
import { normalizeContent } from "./normalizeContent"

type ContentRecord = {
  slug: string
  fields: Record<string, unknown>
}

type ContentMap = Record<string, { fields: Record<string, unknown> }>

export function mapRecordsToContent(records: ContentRecord[]) {
  const map: ContentMap = {}

  for (const record of records) {
    map[record.slug] = { fields: record.fields }
  }

  return normalizeContent(map)
}

export async function fetchContentBlocks() {
  const pocketbase = getPocketBaseClient()
  const records = await pocketbase.collection(POCKETBASE_COLLECTIONS.contentBlocks).getFullList({
    fields: "slug,fields",
    sort: "slug"
  })

  return mapRecordsToContent(records as ContentRecord[])
}
