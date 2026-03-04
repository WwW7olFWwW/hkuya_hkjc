<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(defineProps<{
  modelValue: string[]
  label: string
  rows?: number
  placeholder?: string
}>(), {
  rows: 3,
  placeholder: ""
})

const emit = defineEmits<{
  "update:modelValue": [value: string[]]
}>()

const displayText = computed(function () {
  return props.modelValue.join("\n")
})

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  const lines = target.value.split("\n")
  const filtered: string[] = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed !== "") {
      filtered.push(trimmed)
    }
  }
  emit("update:modelValue", filtered)
}
</script>

<template>
  <div class="mb-4">
    <label class="admin-label">{{ label }}</label>
    <textarea
      class="admin-input w-full"
      :value="displayText"
      :rows="rows"
      :placeholder="placeholder"
      @input="handleInput"
    ></textarea>
  </div>
</template>
