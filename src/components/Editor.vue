<template>
  <div
    ref="editorRef"
    class="editor"
    contenteditable="true"
    @input="handleInput"
    @keydown.tab="handleTab"
    spellcheck="false"
  ></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'

const props = defineProps<{
  content: string
}>()

const emit = defineEmits<{
  (e: 'update:content', value: string): void
}>()

const editorRef = ref<HTMLElement | null>(null)

const handleInput = () => {
  if (editorRef.value) {
    emit('update:content', editorRef.value.innerText)
  }
}

const handleTab = (e: KeyboardEvent) => {
  e.preventDefault()
  document.execCommand('insertText', false, '  ')
}

// 同步内容变化到编辑器
watch(
  () => props.content,
  (newContent) => {
    if (editorRef.value && editorRef.value.innerText !== newContent) {
      editorRef.value.innerText = newContent
    }
  },
  { immediate: true },
)

// 保持光标位置
onMounted(() => {
  nextTick(() => {
    if (editorRef.value) {
      editorRef.value.focus()
    }
  })
})
</script>

<style scoped>
.editor {
  width: 100%;
  height: 100%;
  padding: 20px;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  outline: none;
  white-space: pre-wrap;
  overflow-y: auto;
  tab-size: 2;
}
</style>
