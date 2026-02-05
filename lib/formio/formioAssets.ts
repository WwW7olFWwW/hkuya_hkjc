type FormioAssets = {
  script: string
  style: string
  embedCSS: string
}

type FormioConfig = {
  script?: string
  style?: string
  embedCSS?: string
  full?: boolean
}

type FormioFacade = {
  config?: FormioConfig
}

function normalizeBaseUrl(baseUrl: string) {
  const trimmed = baseUrl ? baseUrl.trim() : ""
  if (!trimmed) {
    return "/"
  }
  if (trimmed.endsWith("/")) {
    return trimmed
  }
  return trimmed + "/"
}

export function buildFormioAssets(baseUrl: string): FormioAssets {
  const normalized = normalizeBaseUrl(baseUrl)

  return {
    script: normalized + "formio/formio.full.min.js",
    style: normalized + "formio/formio.full.min.css",
    embedCSS: normalized + "formio/formio.embed.css"
  }
}

export function applyFormioAssets(formio: FormioFacade, baseUrl: string) {
  if (!formio) {
    return
  }

  const assets = buildFormioAssets(baseUrl)
  const config = formio.config ? formio.config : {}

  config.script = assets.script
  config.style = assets.style
  config.embedCSS = assets.embedCSS
  config.full = true

  formio.config = config
}
