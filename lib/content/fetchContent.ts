import { getSupabaseClient } from "../supabase/client"
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
  const supabase = getSupabaseClient()
  const response = await supabase.from("content_blocks").select("slug, fields")

  if (response.error) {
    throw response.error
  }

  return mapRecordsToContent(response.data as ContentRecord[])
}
