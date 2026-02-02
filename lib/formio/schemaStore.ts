import { getSupabaseClient } from "@/lib/supabase/client"
import { pickHistoryIdsToDelete } from "./schemaHistory"

export type FormioSchemaRecord = {
  slug: string
  schema: Record<string, unknown>
  version: string
  updated_at?: string
  updated_by?: string | null
}

export type FormioHistoryRecord = {
  id?: number
  slug: string
  schema: Record<string, unknown>
  version: string
  created_at?: string
  created_by?: string | null
}

export async function fetchFormSchema(slug: string) {
  const supabase = getSupabaseClient()
  const response = await supabase
    .from("formio_forms")
    .select("slug, schema, version, updated_at, updated_by")
    .eq("slug", slug)
    .maybeSingle()

  if (response.error) {
    throw response.error
  }

  return response.data as FormioSchemaRecord | null
}

export async function fetchAllFormSchemas() {
  const supabase = getSupabaseClient()
  const response = await supabase.from("formio_forms").select("slug")

  if (response.error) {
    throw response.error
  }

  return (response.data || []) as Array<{ slug: string }>
}

export async function fetchFormHistory(slug: string, limit: number) {
  const supabase = getSupabaseClient()
  const response = await supabase
    .from("formio_forms_history")
    .select("id, slug, schema, version, created_at, created_by")
    .eq("slug", slug)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (response.error) {
    throw response.error
  }

  return (response.data || []) as FormioHistoryRecord[]
}

export async function saveFormSchema(
  slug: string,
  schema: Record<string, unknown>,
  version: string,
  updatedBy?: string
) {
  const supabase = getSupabaseClient()
  const upsertResponse = await supabase
    .from("formio_forms")
    .upsert(
      { slug: slug, schema: schema, version: version, updated_by: updatedBy || null },
      { onConflict: "slug" }
    )

  if (upsertResponse.error) {
    throw upsertResponse.error
  }

  const historyResponse = await supabase
    .from("formio_forms_history")
    .insert({ slug: slug, schema: schema, version: version, created_by: updatedBy || null })

  if (historyResponse.error) {
    throw historyResponse.error
  }

  await trimHistory(slug, 7)
}

export async function trimHistory(slug: string, keep: number) {
  const supabase = getSupabaseClient()
  const response = await supabase
    .from("formio_forms_history")
    .select("id, slug, created_at")
    .eq("slug", slug)
    .order("created_at", { ascending: false })

  if (response.error) {
    throw response.error
  }

  const items = (response.data || []) as Array<{ id: number; slug: string; created_at: string }>
  const deleteIds = pickHistoryIdsToDelete(items, slug, keep)

  if (deleteIds.length === 0) {
    return
  }

  const deleteResponse = await supabase.from("formio_forms_history").delete().in("id", deleteIds)
  if (deleteResponse.error) {
    throw deleteResponse.error
  }
}

export async function rollbackSchema(slug: string, history: FormioHistoryRecord) {
  const supabase = getSupabaseClient()
  const version = history.version
  const schema = history.schema

  const upsertResponse = await supabase
    .from("formio_forms")
    .upsert(
      { slug: slug, schema: schema, version: version, updated_by: history.created_by || null },
      { onConflict: "slug" }
    )

  if (upsertResponse.error) {
    throw upsertResponse.error
  }

  const historyResponse = await supabase
    .from("formio_forms_history")
    .insert({ slug: slug, schema: schema, version: version, created_by: history.created_by || null })

  if (historyResponse.error) {
    throw historyResponse.error
  }

  await trimHistory(slug, 7)
}
