<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useConfirmDialog } from "@/lib/ui/useConfirmDialog"

const { isOpen, dialogConfig, handleConfirm, handleCancel } = useConfirmDialog()
</script>

<template>
  <Dialog :open="isOpen" @update:open="handleCancel">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ dialogConfig.title }}</DialogTitle>
      </DialogHeader>
      <p class="text-sm text-slate-600">{{ dialogConfig.message }}</p>
      <DialogFooter>
        <button type="button" @click="handleCancel" class="admin-action-subtle">
          {{ dialogConfig.cancelText }}
        </button>
        <button type="button" @click="handleConfirm" class="admin-action-primary">
          {{ dialogConfig.confirmText }}
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
