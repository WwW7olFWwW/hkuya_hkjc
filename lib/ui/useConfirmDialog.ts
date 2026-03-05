import { ref } from "vue"

const isOpen = ref(false)
const dialogConfig = ref({ title: "", message: "", confirmText: "確定", cancelText: "取消" })
let resolvePromise: (value: boolean) => void

export function useConfirmDialog() {
  function confirm(config: typeof dialogConfig.value) {
    dialogConfig.value = config
    isOpen.value = true
    return new Promise<boolean>(function(resolve) {
      resolvePromise = resolve
    })
  }

  function handleConfirm() {
    isOpen.value = false
    resolvePromise(true)
  }

  function handleCancel() {
    isOpen.value = false
    resolvePromise(false)
  }

  return { confirm, isOpen, dialogConfig, handleConfirm, handleCancel }
}
