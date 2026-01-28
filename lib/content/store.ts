import { ref } from "vue"
import { defaultContent } from "./defaultContent"
import { fetchContentBlocks } from "./fetchContent"

const contentState = ref(defaultContent)

export function useContentStore() {
  return {
    contentState,
    async load() {
      const content = await fetchContentBlocks()
      contentState.value = content
    }
  }
}
