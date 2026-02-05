import { getPocketBaseClient } from "../pocketbase/client"
import { POCKETBASE_COLLECTIONS } from "../pocketbase/collections"
import { normalizeContent } from "./normalizeContent"

type ContentMap = Record<string, { fields: Record<string, unknown> }>

type ChangePayload = {
  action?: "create" | "update" | "delete"
  record?: {
    slug?: string
    fields?: Record<string, unknown>
  }
}

type ChangeHandler = {
  (payload: ChangePayload): void
}

function extractPayloadRecord(payload: ChangePayload) {
  if (!payload || !payload.record) {
    return null
  }

  const record = payload.record
  if (!record.slug || !record.fields) {
    return null
  }

  return {
    slug: record.slug,
    fields: record.fields
  }
}

export function applyContentUpdate(current: ContentMap, payload: ChangePayload) {
  const next: ContentMap = {}
  const keys = Object.keys(current)

  for (const key of keys) {
    next[key] = current[key]
  }

  const record = extractPayloadRecord(payload)
  if (record) {
    next[record.slug] = { fields: record.fields }
  }

  return normalizeContent(next)
}

export async function subscribeContentChanges(handler: ChangeHandler) {
  const pocketbase = getPocketBaseClient()
  const unsubscribe = await pocketbase
    .collection(POCKETBASE_COLLECTIONS.contentBlocks)
    .subscribe("*", function (payload) {
      handler(payload as ChangePayload)
    })

  return {
    unsubscribe: function () {
      return unsubscribe()
    }
  }
}
