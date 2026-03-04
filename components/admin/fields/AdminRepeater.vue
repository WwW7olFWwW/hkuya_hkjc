<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: any[]
  emptyItem: Record<string, unknown>
  addLabel?: string
  min?: number
  label?: string
}>(), {
  addLabel: "+ 新增",
  min: 0,
  label: ""
})

const emit = defineEmits<{
  "update:modelValue": [value: any[]]
}>()

function addItem() {
  const newItem = JSON.parse(JSON.stringify(props.emptyItem))
  const newList = props.modelValue.slice()
  newList.push(newItem)
  emit("update:modelValue", newList)
}

function removeItem(index: number) {
  if (props.modelValue.length <= props.min) return
  const newList = props.modelValue.slice()
  newList.splice(index, 1)
  emit("update:modelValue", newList)
}
</script>

<template>
  <div class="mb-6">
    <div v-if="label" class="admin-label mb-2">{{ label }}</div>
    <div
      v-for="(item, index) in modelValue"
      :key="index"
      class="border border-slate-200 rounded-lg p-4 mb-3 relative"
    >
      <slot name="item" :item="item" :index="index"></slot>
      <button
        type="button"
        data-test="remove-btn"
        class="admin-action--subtle text-red-500 text-sm mt-2"
        :disabled="modelValue.length <= min"
        @click="removeItem(index)"
      >
        刪除
      </button>
    </div>
    <button
      type="button"
      data-test="add-btn"
      class="admin-action--secondary text-sm"
      @click="addItem"
    >
      {{ addLabel }}
    </button>
  </div>
</template>
