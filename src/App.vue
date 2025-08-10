<template>
  <div class="app-container">
    <FileExplorer />

    <div class="editor-container" v-if="activeFile">
      <MarkdownEditor v-model:content="content" ref="editorRef" />
      <MarkdownPreview :content="content" ref="previewRef" />
    </div>

    <div v-else class="empty-state">
      <p>没有可编辑的文件，请创建一个新文件</p>
      <button @click="createNewFile">新建文件</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import FileExplorer from '@/components/FileExplorer.vue'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import MarkdownPreview from '@/components/MarkdownPreview.vue'
import { useFileSystem } from '@/composables/useFileSystem'
import { useSyncScroll } from '@/composables/useSyncScroll'

const { activeFile, updateFileContent, createNewFile } = useFileSystem()

const editorRef = ref<InstanceType<typeof MarkdownEditor> | null>(null)
const previewRef = ref<InstanceType<typeof MarkdownPreview> | null>(null)

const content = computed({
  get: () => activeFile.value?.content || '',
  set: (value) => {
    if (activeFile.value) {
      updateFileContent(activeFile.value.id, value)
    }
  },
})

// 当活动文件变化时，更新Markdown内容
watch(
  () => activeFile.value?.content,
  (newContent) => {
    if (newContent !== undefined) {
      content.value = newContent
    }
  },
)

// 设置滚动同步
useSyncScroll(
  computed(() => editorRef.value?.$el),
  computed(() => previewRef.value?.$el),
)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  height: 100vh;
  overflow: hidden;
}

.app-container {
  display: flex;
  height: 100vh;
}

.editor-container {
  display: flex;
  flex-grow: 1;
  height: 100%;
}

.editor-container > * {
  flex: 1;
  height: 100%;
  overflow-y: auto;
}

.empty-state {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
</style>
