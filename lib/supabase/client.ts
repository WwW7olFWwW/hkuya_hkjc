import { createClient } from "@supabase/supabase-js"

type RuntimeEnv = {
  __SUPABASE_URL__?: string
  __SUPABASE_ANON_KEY__?: string
}

const runtimeEnv = (typeof globalThis !== "undefined" ? (globalThis as RuntimeEnv) : {}) as RuntimeEnv
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || runtimeEnv.__SUPABASE_URL__ || ""
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || runtimeEnv.__SUPABASE_ANON_KEY__ || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
