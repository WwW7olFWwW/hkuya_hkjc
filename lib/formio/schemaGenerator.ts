import { defaultContent } from "@/lib/content/defaultContent"

type FormioComponent = {
  type: string
  key: string
  label?: string
  title?: string
  input?: boolean
  components?: FormioComponent[]
}

type FormioSchema = {
  title: string
  type: string
  display: string
  components: FormioComponent[]
}

function toLabel(key: string) {
  return key
}

function shouldUseTextarea(key: string) {
  const lower = key.toLowerCase()
  return (
    lower.indexOf("description") !== -1 ||
    lower.indexOf("content") !== -1 ||
    lower.indexOf("notes") !== -1
  )
}

function buildTextField(key: string) {
  return {
    type: "textfield",
    key: key,
    label: toLabel(key),
    input: true
  } as FormioComponent
}

function buildTextAreaField(key: string) {
  return {
    type: "textarea",
    key: key,
    label: toLabel(key),
    input: true
  } as FormioComponent
}

function buildNumberField(key: string) {
  return {
    type: "number",
    key: key,
    label: toLabel(key),
    input: true
  } as FormioComponent
}

function buildCheckboxField(key: string) {
  return {
    type: "checkbox",
    key: key,
    label: toLabel(key),
    input: true
  } as FormioComponent
}

function buildPanelField(key: string, components: FormioComponent[]) {
  return {
    type: "panel",
    key: key,
    title: toLabel(key),
    components: components
  } as FormioComponent
}

function buildEditGridField(key: string, components: FormioComponent[]) {
  return {
    type: "editgrid",
    key: key,
    label: toLabel(key),
    input: true,
    components: components
  } as FormioComponent
}

function buildComponentFromArray(key: string, value: unknown[]) {
  if (value.length === 0) {
    return buildTextAreaField(key)
  }
  const sample = value[0]
  if (typeof sample === "string") {
    return buildTextAreaField(key)
  }
  if (typeof sample === "number") {
    return buildNumberField(key)
  }
  if (typeof sample === "boolean") {
    return buildCheckboxField(key)
  }
  if (sample && typeof sample === "object" && !Array.isArray(sample)) {
    const components = buildComponentsFromObject(sample as Record<string, unknown>)
    return buildEditGridField(key, components)
  }
  return buildTextField(key)
}

function buildComponentFromValue(key: string, value: unknown) {
  if (Array.isArray(value)) {
    return buildComponentFromArray(key, value)
  }
  if (typeof value === "string") {
    if (shouldUseTextarea(key)) {
      return buildTextAreaField(key)
    }
    return buildTextField(key)
  }
  if (typeof value === "number") {
    return buildNumberField(key)
  }
  if (typeof value === "boolean") {
    return buildCheckboxField(key)
  }
  if (value && typeof value === "object") {
    const components = buildComponentsFromObject(value as Record<string, unknown>)
    return buildPanelField(key, components)
  }
  return buildTextField(key)
}

function buildComponentsFromObject(fields: Record<string, unknown>) {
  const keys = Object.keys(fields)
  const components: FormioComponent[] = []

  for (const key of keys) {
    const value = fields[key]
    const component = buildComponentFromValue(key, value)
    components.push(component)
  }

  return components
}

export function buildFormioSchemaFromDefault(slug: string): FormioSchema {
  const entry = defaultContent[slug as keyof typeof defaultContent]
  const fields = entry ? (entry.fields as Record<string, unknown>) : {}

  return {
    title: slug,
    type: "form",
    display: "form",
    components: buildComponentsFromObject(fields)
  }
}
