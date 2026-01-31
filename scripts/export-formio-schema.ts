import { createClient } from "@supabase/supabase-js"
import { writeFile, mkdir } from "node:fs/promises"
import path from "node:path"
import { pickHistoryIdsToDelete } from "../lib/formio/schemaHistory"

type HistoryRow = {
  id: number
  slug: string
  created_at: string
}

type SchemaRow = {
  schema: Record<string, unknown>
}

function readEnv(name: string) {
  return process.env[name] || ""
}

function getSupabaseConfig() {
  const url = readEnv("VITE_SUPABASE_URL") || readEnv("SUPABASE_URL")
  const key = readEnv("VITE_SUPABASE_ANON_KEY") || readEnv("SUPABASE_ANON_KEY")

  if (!url || !key) {
    throw new Error("Missing Supabase env: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required.")
  }

  return { url: url, key: key }
}

export function buildExportPath(slug: string) {
  return path.posix.join("lib", "forms", "formio", slug + ".json")
}

function getSlugArg() {
  const argIndex = process.argv.indexOf("--slug")
  if (argIndex !== -1 && process.argv.length > argIndex + 1) {
    return process.argv[argIndex + 1]
  }
  if (process.argv.length > 2) {
    return process.argv[2]
  }
  return ""
}

async function trimHistory(supabase: ReturnType<typeof createClient>, slug: string, keep: number) {
  const response = await supabase
    .from("formio_forms_history")
    .select("id, slug, created_at")
    .eq("slug", slug)
    .order("created_at", { ascending: false })

  if (response.error) {
    throw response.error
  }

  const items = (response.data || []) as HistoryRow[]
  const deleteIds = pickHistoryIdsToDelete(items, slug, keep)

  if (deleteIds.length === 0) {
    return
  }

  const deleteResponse = await supabase.from("formio_forms_history").delete().in("id", deleteIds)
  if (deleteResponse.error) {
    throw deleteResponse.error
  }
}

async function exportSchema(slug: string) {
  const config = getSupabaseConfig()
  const supabase = createClient(config.url, config.key)

  const schemaResponse = await supabase
    .from("formio_forms")
    .select("schema")
    .eq("slug", slug)
    .maybeSingle()

  if (schemaResponse.error) {
    throw schemaResponse.error
  }

  if (!schemaResponse.data) {
    throw new Error("Schema not found for slug: " + slug)
  }

  const schemaRow = schemaResponse.data as SchemaRow
  const schema = schemaRow.schema
  const version = String(Date.now())

  const historyResponse = await supabase
    .from("formio_forms_history")
    .insert({ slug: slug, schema: schema, version: version })

  if (historyResponse.error) {
    throw historyResponse.error
  }

  await trimHistory(supabase, slug, 7)

  const exportPath = buildExportPath(slug)
  const absolutePath = path.resolve(exportPath)
  await mkdir(path.dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, JSON.stringify(schema, null, 2) + "\n", "utf8")

  return exportPath
}

async function run() {
  const slug = getSlugArg()
  if (!slug) {
    throw new Error("Missing slug. Usage: npm run formio:export -- --slug <slug>")
  }

  const exportPath = await exportSchema(slug)
  console.log("Exported schema to", exportPath)
}

if (require.main === module) {
  run().catch(function (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
}
