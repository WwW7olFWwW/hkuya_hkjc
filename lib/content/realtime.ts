import { getSupabaseClient } from "../supabase/client"
import { normalizeContent } from "./normalizeContent"

type ContentMap = Record<string, { fields: Record<string, unknown> }>

type ChangePayload = {
  new: {
    slug: string
    fields: Record<string, unknown>
  }
}

type ChangeHandler = {
  (payload: ChangePayload): void
}

export function applyContentUpdate(current: ContentMap, payload: ChangePayload) {
  const next: ContentMap = {}
  const keys = Object.keys(current)

  for (const key of keys) {
    next[key] = current[key]
  }

  if (payload && payload.new) {
    next[payload.new.slug] = { fields: payload.new.fields }
  }

  return normalizeContent(next)
}

export function subscribeContentChanges(handler: ChangeHandler) {
  const supabase = getSupabaseClient()
  return supabase
    .channel("content_blocks_changes")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "content_blocks" },
      function (payload) {
        handler(payload as ChangePayload)
      }
    )
    .subscribe()
}
