import PocketBase from "pocketbase"

type RuntimeEnv = {
  __POCKETBASE_URL__?: string
}

type PocketBaseConfig = {
  url: string
}

let cachedClient: PocketBase | null = null

function normalizePocketBaseUrl(url: string): string {
  if (!url) {
    return ""
  }

  if (url.startsWith("/") && typeof window !== "undefined" && window.location) {
    return window.location.origin + url
  }

  return url
}

function resolvePocketBaseConfig(): PocketBaseConfig {
  const runtimeEnv = (typeof globalThis !== "undefined" ? (globalThis as RuntimeEnv) : {}) as RuntimeEnv
  const pocketbaseUrl = normalizePocketBaseUrl(
    runtimeEnv.__POCKETBASE_URL__ || import.meta.env.VITE_POCKETBASE_URL || ""
  )

  if (!pocketbaseUrl) {
    throw new Error("pocketbaseUrl is required.")
  }

  return {
    url: pocketbaseUrl
  }
}

export function getPocketBaseClient() {
  if (cachedClient) {
    return cachedClient
  }

  const config = resolvePocketBaseConfig()
  cachedClient = new PocketBase(config.url)
  return cachedClient
}
