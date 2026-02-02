import { createClient, type SupabaseClient } from "@supabase/supabase-js"

type RuntimeEnv = {
  __SUPABASE_URL__?: string
  __SUPABASE_ANON_KEY__?: string
}

type SupabaseConfig = {
  url: string
  anonKey: string
}

let cachedClient: SupabaseClient | null = null

function resolveSupabaseConfig(): SupabaseConfig {
  const runtimeEnv = (typeof globalThis !== "undefined" ? (globalThis as RuntimeEnv) : {}) as RuntimeEnv
  const supabaseUrl = runtimeEnv.__SUPABASE_URL__ || import.meta.env.VITE_SUPABASE_URL || ""
  const supabaseAnonKey = runtimeEnv.__SUPABASE_ANON_KEY__ || import.meta.env.VITE_SUPABASE_ANON_KEY || ""

  if (!supabaseUrl) {
    throw new Error("supabaseUrl is required.")
  }

  if (!supabaseAnonKey) {
    throw new Error("supabaseAnonKey is required.")
  }

  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey
  }
}

export function getSupabaseClient() {
  if (cachedClient) {
    return cachedClient
  }

  const config = resolveSupabaseConfig()
  cachedClient = createClient(config.url, config.anonKey)
  return cachedClient
}
