import { getPocketBaseClient } from "@/lib/pocketbase/client"
import { POCKETBASE_COLLECTIONS } from "@/lib/pocketbase/collections"
import { pickHistoryIdsToDelete } from "./schemaHistory"

type PocketBaseRecord = Record<string, unknown> & {
  id?: string
  created?: string
  updated?: string
}

export type FormioSchemaRecord = {
  slug: string
  schema: Record<string, unknown>
  version: string
  updated_at?: string
  updated_by?: string | null
}

export type FormioHistoryRecord = {
  id?: string
  slug: string
  schema: Record<string, unknown>
  version: string
  created_at?: string
  created_by?: string | null
}

function isNotFoundError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false
  }
  if (!("status" in error)) {
    return false
  }
  return (error as { status?: number }).status === 404
}

function buildSlugFilter(slug: string) {
  const safeSlug = slug.replace(/"/g, "\\\"")
  return "slug = \"" + safeSlug + "\""
}

async function findRecordBySlug(collection: string, slug: string, fields: string) {
  const pocketbase = getPocketBaseClient()
  try {
    const record = await pocketbase
      .collection(collection)
      .getFirstListItem(buildSlugFilter(slug), { fields: fields })
    return record as PocketBaseRecord
  } catch (error) {
    if (isNotFoundError(error)) {
      return null
    }
    throw error
  }
}

function mapSchemaRecord(record: PocketBaseRecord): FormioSchemaRecord {
  const schema = record.schema && typeof record.schema === "object" ? (record.schema as Record<string, unknown>) : {}
  return {
    slug: String(record.slug || ""),
    schema: schema,
    version: String(record.version || ""),
    updated_at: typeof record.updated === "string" ? record.updated : undefined,
    updated_by: record.updated_by ? String(record.updated_by) : null
  }
}

function mapHistoryRecord(record: PocketBaseRecord): FormioHistoryRecord {
  const schema = record.schema && typeof record.schema === "object" ? (record.schema as Record<string, unknown>) : {}
  return {
    id: record.id ? String(record.id) : undefined,
    slug: String(record.slug || ""),
    schema: schema,
    version: String(record.version || ""),
    created_at: typeof record.created === "string" ? record.created : undefined,
    created_by: record.created_by ? String(record.created_by) : null
  }
}

export async function fetchFormSchema(slug: string) {
  const record = await findRecordBySlug(
    POCKETBASE_COLLECTIONS.formioForms,
    slug,
    "id,slug,schema,version,updated,updated_by"
  )

  if (!record) {
    return null
  }

  return mapSchemaRecord(record)
}

export async function fetchAllFormSchemas() {
  const pocketbase = getPocketBaseClient()
  const records = await pocketbase.collection(POCKETBASE_COLLECTIONS.formioForms).getFullList({
    fields: "slug",
    sort: "slug"
  })

  return (records || []) as Array<{ slug: string }>
}

export async function fetchFormHistory(slug: string, limit: number) {
  const pocketbase = getPocketBaseClient()
  const result = await pocketbase.collection(POCKETBASE_COLLECTIONS.formioFormsHistory).getList(1, limit, {
    fields: "id,slug,schema,version,created,created_by",
    filter: buildSlugFilter(slug),
    sort: "-created"
  })

  const items = result.items || []
  const mapped: FormioHistoryRecord[] = []
  for (const record of items) {
    mapped.push(mapHistoryRecord(record as PocketBaseRecord))
  }

  return mapped
}

export async function saveFormSchema(
  slug: string,
  schema: Record<string, unknown>,
  version: string,
  updatedBy?: string
) {
  const pocketbase = getPocketBaseClient()
  const existing = await findRecordBySlug(POCKETBASE_COLLECTIONS.formioForms, slug, "id")

  if (existing && existing.id) {
    await pocketbase
      .collection(POCKETBASE_COLLECTIONS.formioForms)
      .update(existing.id, { slug: slug, schema: schema, version: version, updated_by: updatedBy || null })
  } else {
    await pocketbase
      .collection(POCKETBASE_COLLECTIONS.formioForms)
      .create({ slug: slug, schema: schema, version: version, updated_by: updatedBy || null })
  }

  await pocketbase
    .collection(POCKETBASE_COLLECTIONS.formioFormsHistory)
    .create({ slug: slug, schema: schema, version: version, created_by: updatedBy || null })

  await trimHistory(slug, 7)
}

export async function trimHistory(slug: string, keep: number) {
  const pocketbase = getPocketBaseClient()
  const records = await pocketbase.collection(POCKETBASE_COLLECTIONS.formioFormsHistory).getFullList({
    fields: "id,slug,created",
    filter: buildSlugFilter(slug),
    sort: "-created"
  })

  const items: Array<{ id?: string; slug: string; created_at: string }> = []
  for (const record of records) {
    const mapped = mapHistoryRecord(record as PocketBaseRecord)
    if (mapped.created_at) {
      items.push({ id: mapped.id, slug: mapped.slug, created_at: mapped.created_at })
    }
  }

  const deleteIds = pickHistoryIdsToDelete(items, slug, keep)
  if (deleteIds.length === 0) {
    return
  }

  for (const id of deleteIds) {
    await pocketbase.collection(POCKETBASE_COLLECTIONS.formioFormsHistory).delete(id)
  }
}

export async function rollbackSchema(slug: string, history: FormioHistoryRecord) {
  const pocketbase = getPocketBaseClient()
  const version = history.version
  const schema = history.schema
  const existing = await findRecordBySlug(POCKETBASE_COLLECTIONS.formioForms, slug, "id")

  if (existing && existing.id) {
    await pocketbase
      .collection(POCKETBASE_COLLECTIONS.formioForms)
      .update(existing.id, { slug: slug, schema: schema, version: version, updated_by: history.created_by || null })
  } else {
    await pocketbase
      .collection(POCKETBASE_COLLECTIONS.formioForms)
      .create({ slug: slug, schema: schema, version: version, updated_by: history.created_by || null })
  }

  await pocketbase
    .collection(POCKETBASE_COLLECTIONS.formioFormsHistory)
    .create({ slug: slug, schema: schema, version: version, created_by: history.created_by || null })

  await trimHistory(slug, 7)
}
