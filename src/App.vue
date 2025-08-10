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
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import FileExplorer from '@/components/FileExplorer.vue'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import MarkdownPreview from '@/components/MarkdownPreview.vue'
import { useSyncScroll } from '@/composables/useSyncScroll'
import { useFileStore } from '@/stores/files'

const fileStore = useFileStore()
const { activeFile } = storeToRefs(fileStore)
const { updateFileContent, createNewFile } = fileStore

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
