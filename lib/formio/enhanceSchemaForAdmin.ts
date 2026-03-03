type UnknownRecord = Record<string, unknown>

type FormioComponent = {
  key?: string
  type?: string
  label?: string
  title?: string
  description?: string
  placeholder?: string
  input?: boolean
  rows?: unknown
  inlineEdit?: boolean
  openWhenEmpty?: boolean
  addAnother?: string
  saveRow?: string
  cancelRow?: string
  removeRow?: string
  image?: boolean
  camera?: boolean
  webcam?: boolean
  storage?: string
  multiple?: boolean
  uploadOnly?: boolean
  filePattern?: string
  fileTypes?: Array<{ label: string; value: string }>
  fileMaxSize?: string
  components?: unknown
  columns?: unknown
  rows?: unknown
}

const POSITION_LABELS: Record<string, string> = {
  titleZh: "標題（中文）",
  titleEn: "Title (English)",
  groups: "地區分組",
  location: "地區 Location",
  description: "地區描述 Description",
  positions: "崗位列表 Positions",
  companyLines: "公司名稱（每行一條）",
  roleLines: "崗位名稱（每行一條）",
  requirements: "崗位要求（每行一條）",
  duties: "工作內容（每行一條）"
}

const ABOUT_US_LABELS: Record<string, string> = {
  titleZh: "標題（中文）",
  titleEn: "Title (English)",
  organizations: "機構列表",
  role: "角色 Role",
  name: "機構名稱 Name",
  logo: "機構 Logo",
  url: "連結網址 URL"
}

const PROJECT_INTRO_LABELS: Record<string, string> = {
  titleZh: "標題（中文）",
  subtitleZh: "副標（中文）",
  titleEn: "Title (English)",
  subtitleEn: "Subtitle (English)",
  descriptionZh: "描述（中文）",
  descriptionEn: "Description (English)",
  posterUrl: "海報圖片 Poster",
  infoCards: "資訊卡片",
  contentZh: "內容（中文）",
  contentEn: "Content (English)",
  eligibilityZh: "參加資格（中文）",
  eligibilityEn: "Eligibility (English)",
  feeZh: "費用（中文）",
  feeEn: "Fee (English)"
}

const LINE_TEXTAREA_HINTS: Record<string, { placeholder: string; description: string; rows: number }> = {
  companyLines: {
    placeholder: "每行輸入一條，例如：\n公司中文名\nCompany English Name",
    description: "每行一條，前台會顯示為多行資訊。",
    rows: 5
  },
  roleLines: {
    placeholder: "每行輸入一條，例如：\n崗位中文名\nRole English Name",
    description: "每行一條，建議中英各一行。",
    rows: 4
  },
  requirements: {
    placeholder: "每行輸入一條崗位要求",
    description: "每行一條，前台會自動轉為清單。",
    rows: 6
  },
  duties: {
    placeholder: "每行輸入一條工作內容",
    description: "每行一條，前台會自動轉為清單。",
    rows: 6
  }
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function applyLabel(component: FormioComponent) {
  if (!component.key) {
    return
  }

  if (!Object.prototype.hasOwnProperty.call(POSITION_LABELS, component.key)) {
    return
  }

  const label = POSITION_LABELS[component.key]
  component.label = label

  if (component.type === "panel") {
    component.title = label
  }
}

function applyLabelMap(component: FormioComponent, labels: Record<string, string>) {
  if (!component.key) {
    return
  }

  if (!Object.prototype.hasOwnProperty.call(labels, component.key)) {
    return
  }

  const label = labels[component.key]
  component.label = label

  if (component.type === "panel") {
    component.title = label
  }
}

function applyGridBehavior(component: FormioComponent) {
  if (!component.key || component.type !== "editgrid") {
    return
  }

  if (component.key === "groups") {
    component.inlineEdit = false
    component.openWhenEmpty = true
    component.addAnother = "新增地區分組"
    component.saveRow = "儲存分組"
    component.cancelRow = "取消"
    component.removeRow = "刪除"
    return
  }

  if (component.key === "positions") {
    component.inlineEdit = false
    component.openWhenEmpty = true
    component.addAnother = "新增崗位"
    component.saveRow = "儲存崗位"
    component.cancelRow = "取消"
    component.removeRow = "刪除"
  }
}

function applyAboutUsGridBehavior(component: FormioComponent) {
  if (component.key !== "organizations" || component.type !== "editgrid") {
    return
  }

  component.inlineEdit = false
  component.openWhenEmpty = true
  component.addAnother = "新增機構"
  component.saveRow = "儲存機構"
  component.cancelRow = "取消"
  component.removeRow = "刪除"
}

function applyTextareaHints(component: FormioComponent) {
  if (!component.key) {
    return
  }
  if (!Object.prototype.hasOwnProperty.call(LINE_TEXTAREA_HINTS, component.key)) {
    return
  }

  const hint = LINE_TEXTAREA_HINTS[component.key]
  component.type = "textarea"
  component.placeholder = hint.placeholder
  component.description = hint.description
  component.rows = hint.rows
}

function applyDescriptionHint(component: FormioComponent) {
  if (component.key === "description" && component.type === "textfield") {
    component.type = "textarea"
    component.rows = 3
    component.placeholder = "輸入地區描述，例如：科創企業，包括但不限於以下企業（持續更新中）"
  }
}

function applyAboutUsLogoUpload(component: FormioComponent) {
  if (component.key !== "logo") {
    return
  }

  component.type = "file"
  component.input = true
  component.label = "機構 Logo"
  component.storage = "base64"
  component.image = true
  component.webcam = false
  component.camera = false
  component.uploadOnly = false
  component.multiple = true
  component.filePattern = "image/*"
  component.fileTypes = [
    {
      label: "Image",
      value: "image/*"
    }
  ]
  component.fileMaxSize = "5MB"
  component.description = "上傳圖片以替換現有 Logo（支援 jpg/png/webp）。"
}

function applyAboutUsNameHint(component: FormioComponent) {
  if (component.key !== "name") {
    return
  }

  component.placeholder = "例如：中央政府駐港聯絡辦青年工作部"
}

function applyAboutUsUrlHint(component: FormioComponent) {
  if (component.key !== "url") {
    return
  }

  component.placeholder = "https://example.com"
}

function applyProjectIntroPosterUpload(component: FormioComponent) {
  if (component.key !== "posterUrl") {
    return
  }

  component.type = "file"
  component.input = true
  component.label = "海報圖片 Poster"
  component.storage = "base64"
  component.image = true
  component.webcam = false
  component.camera = false
  component.uploadOnly = false
  component.multiple = true
  component.filePattern = "image/*"
  component.fileTypes = [
    {
      label: "Image",
      value: "image/*"
    }
  ]
  component.fileMaxSize = "8MB"
  component.description = "上傳圖片以替換現有海報（支援 jpg/png/webp）。"
}

function visitComponents(components: unknown) {
  if (!Array.isArray(components)) {
    return
  }

  for (const component of components) {
    visitComponent(component)
  }
}

function visitColumns(columns: unknown) {
  if (!Array.isArray(columns)) {
    return
  }

  for (const column of columns) {
    if (!isRecord(column)) {
      continue
    }
    visitComponents(column.components)
  }
}

function visitRows(rows: unknown) {
  if (!Array.isArray(rows)) {
    return
  }

  for (const row of rows) {
    if (!Array.isArray(row)) {
      continue
    }

    for (const column of row) {
      if (!isRecord(column)) {
        continue
      }
      visitComponents(column.components)
    }
  }
}

function visitComponent(component: unknown) {
  if (!isRecord(component)) {
    return
  }

  const record = component as FormioComponent

  applyLabel(record)
  applyGridBehavior(record)
  applyTextareaHints(record)
  applyDescriptionHint(record)

  visitComponents(record.components)
  visitColumns(record.columns)
  visitRows(record.rows)
}

function visitAboutUsComponent(component: unknown) {
  if (!isRecord(component)) {
    return
  }

  const record = component as FormioComponent

  applyLabelMap(record, ABOUT_US_LABELS)
  applyAboutUsGridBehavior(record)
  applyAboutUsLogoUpload(record)
  applyAboutUsNameHint(record)
  applyAboutUsUrlHint(record)

  visitAboutUsComponents(record.components)
  visitColumns(record.columns)
  visitRows(record.rows)
}

function visitAboutUsComponents(components: unknown) {
  if (!Array.isArray(components)) {
    return
  }

  for (const component of components) {
    visitAboutUsComponent(component)
  }
}

function visitProjectIntroComponent(component: unknown) {
  if (!isRecord(component)) {
    return
  }

  const record = component as FormioComponent

  applyLabelMap(record, PROJECT_INTRO_LABELS)
  applyProjectIntroPosterUpload(record)

  visitProjectIntroComponents(record.components)
  visitColumns(record.columns)
  visitRows(record.rows)
}

function visitProjectIntroComponents(components: unknown) {
  if (!Array.isArray(components)) {
    return
  }

  for (const component of components) {
    visitProjectIntroComponent(component)
  }
}

function cloneSchema(schema: UnknownRecord) {
  return JSON.parse(JSON.stringify(schema)) as UnknownRecord
}

export function enhanceSchemaForAdmin(slug: string, schema: UnknownRecord) {
  if (slug !== "positions" && slug !== "about_us" && slug !== "project_intro") {
    return schema
  }

  const cloned = cloneSchema(schema)

  if (slug === "positions") {
    cloned.title = "positions"
    visitComponents(cloned.components)
    return cloned
  }

  if (slug === "about_us") {
    cloned.title = "about_us"
    visitAboutUsComponents(cloned.components)
    return cloned
  }

  if (slug === "project_intro") {
    cloned.title = "project_intro"
    visitProjectIntroComponents(cloned.components)
    return cloned
  }

  return cloned
}
