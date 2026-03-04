import { ref, type Ref } from "vue"
import { getPocketBaseClient } from "@/lib/pocketbase/client"
import { POCKETBASE_COLLECTIONS } from "@/lib/pocketbase/collections"
import { normalizeContent } from "@/lib/content/normalizeContent"
import type { ContentSlug } from "./contentTypes"

interface ContentEditorState {
  fields: Record<string, unknown>
  loading: boolean
  saving: boolean
  error: string | null
  dirty: boolean
}

export function usePocketBaseContent(slug: ContentSlug) {
  const state: Ref<ContentEditorState> = ref({
    fields: {},
    loading: false,
    saving: false,
    error: null,
    dirty: false
  })

  const originalFields = ref<Record<string, unknown>>({})

  async function load() {
    state.value.loading = true
    state.value.error = null
    try {
      const pb = getPocketBaseClient()
      const record = await pb.collection(POCKETBASE_COLLECTIONS.contentBlocks).getFirstListItem(`slug="${slug}"`)
      const normalized = normalizeContent({ [slug]: { fields: record.fields } })
      state.value.fields = normalized[slug].fields
      originalFields.value = JSON.parse(JSON.stringify(state.value.fields))
      state.value.dirty = false
    } catch (error) {
      state.value.error = error instanceof Error ? error.message : "載入失敗"
    } finally {
      state.value.loading = false
    }
  }

  async function save() {
    state.value.saving = true
    state.value.error = null
    try {
      const pb = getPocketBaseClient()
      const record = await pb.collection(POCKETBASE_COLLECTIONS.contentBlocks).getFirstListItem(`slug="${slug}"`)
      await pb.collection(POCKETBASE_COLLECTIONS.contentBlocks).update(record.id, { fields: state.value.fields })
      originalFields.value = JSON.parse(JSON.stringify(state.value.fields))
      state.value.dirty = false
    } catch (error) {
      state.value.error = error instanceof Error ? error.message : "儲存失敗"
      throw error
    } finally {
      state.value.saving = false
    }
  }

  function reset() {
    state.value.fields = JSON.parse(JSON.stringify(originalFields.value))
    state.value.dirty = false
  }

  return { state, load, save, reset }
}
