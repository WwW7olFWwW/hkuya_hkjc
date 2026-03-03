function isLoopbackHttpUrl(url: string) {
  return /^https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?(?:\/|$)/i.test(url)
}

export function resolvePublicPocketBaseUrl(mode: string, envUrl: string | undefined) {
  const normalized = typeof envUrl === "string" ? envUrl.trim() : ""
  if (!normalized) {
    return "/pb"
  }
  if (mode === "production" && isLoopbackHttpUrl(normalized)) {
    return "/pb"
  }
  return normalized
}
