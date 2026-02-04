type UnknownRecord = Record<string, unknown>

type FormioComponent = {
  type?: string
  components?: FormioComponent[]
  columns?: Array<{ components?: FormioComponent[] }>
  rows?: Array<Array<{ components?: FormioComponent[] }>>
  collapsible?: boolean
  collapsed?: boolean
  inlineEdit?: boolean
  openWhenEmpty?: boolean
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function applyTypeDefaults(component: FormioComponent) {
  if (component.type === "panel" || component.type === "fieldset") {
    component.collapsed = false
    if (typeof component.collapsible !== "boolean") {
      component.collapsible = false
    }
  }

  if (component.type === "editgrid") {
    component.inlineEdit = true
    component.openWhenEmpty = true
  }

  if (component.type === "textarea") {
    component.autoExpand = true
  }
}

function normalizeComponents(components: FormioComponent[]) {
  for (const component of components) {
    normalizeComponent(component)
  }
}

function normalizeColumns(columns: Array<{ components?: FormioComponent[] }>) {
  for (const column of columns) {
    if (column.components && Array.isArray(column.components)) {
      normalizeComponents(column.components)
    }
  }
}

function normalizeRows(rows: Array<Array<{ components?: FormioComponent[] }>>) {
  for (const row of rows) {
    for (const column of row) {
      if (column.components && Array.isArray(column.components)) {
        normalizeComponents(column.components)
      }
    }
  }
}

function normalizeComponent(component: FormioComponent) {
  applyTypeDefaults(component)

  if (component.components && Array.isArray(component.components)) {
    normalizeComponents(component.components)
  }

  if (component.columns && Array.isArray(component.columns)) {
    normalizeColumns(component.columns)
  }

  if (component.rows && Array.isArray(component.rows)) {
    normalizeRows(component.rows)
  }
}

export function applySchemaDefaults(schema: UnknownRecord) {
  const cloned = JSON.parse(JSON.stringify(schema)) as UnknownRecord

  if (isRecord(cloned) && Array.isArray(cloned.components)) {
    normalizeComponents(cloned.components as FormioComponent[])
  }

  return cloned
}
