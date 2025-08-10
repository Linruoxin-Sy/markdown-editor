<template>
  <div ref="container" class="preview"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { patch } from 'incremental-dom'
import md from '@/utils/markdown'

const container = ref<HTMLElement | null>(null)

// 接收 content 属性
const props = defineProps({
  content: {
    type: String,
    required: true,
  },
})

function render() {
  if (!container.value) return

  const func = md.renderToIncrementalDOM(props.content)

  patch(container.value as HTMLElement, func)
}

watch(() => props.content, render, { immediate: true })
onMounted(render)
</script>

<style scoped>
.preview {
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  border-left: 1px solid #ddd;
}

.preview :deep(pre) {
  background-color: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow: auto;
}

.preview :deep(code) {
  font-family: 'Courier New', monospace;
}

.preview :deep(h1) {
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.preview :deep(h2) {
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.preview :deep(table) {
  border-collapse: collapse;
  width: 100%;
}

.preview :deep(th),
.preview :deep(td) {
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
}

.preview :deep(blockquote) {
  border-left: 4px solid #dfe2e5;
  color: #6a737d;
  padding: 0 1em;
  margin-left: 0;
}
</style>
