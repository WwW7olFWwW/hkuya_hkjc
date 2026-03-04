<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string | number | boolean
  label: string
  type?: "text" | "textarea" | "number" | "checkbox"
  rows?: number
  placeholder?: string
}>(), {
  type: "text",
  rows: 3,
  placeholder: ""
})

const emit = defineEmits<{
  "update:modelValue": [value: string | number | boolean]
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  if (props.type === "checkbox") {
    emit("update:modelValue", target.checked)
  } else if (props.type === "number") {
    emit("update:modelValue", Number(target.value))
  } else {
    emit("update:modelValue", target.value)
  }
}
</script>

<template>
  <div class="mb-4" :class="{ 'flex items-center gap-2': type === 'checkbox' }">
    <label class="admin-label">{{ label }}</label>
    <textarea
      v-if="type === 'textarea'"
      class="admin-input w-full"
      :value="String(modelValue)"
      :rows="rows"
      :placeholder="placeholder"
      @input="handleInput"
    ></textarea>
    <input
      v-else-if="type === 'checkbox'"
      type="checkbox"
      :checked="Boolean(modelValue)"
      @change="handleInput"
    />
    <input
      v-else
      class="admin-input w-full"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="handleInput"
    />
  </div>
</template>
