<template>
  <div class="file-explorer">
    <div class="toolbar">
      <button @click="createNewFile">新建文件</button>
      <input
        type="file"
        id="file-import"
        accept=".md,.markdown"
        @change="handleFileImport"
        style="display: none"
      />
      <label for="file-import" class="import-btn">导入文件</label>
    </div>

    <ul class="file-list">
      <li
        v-for="file in files"
        :key="file.id"
        :class="{ active: file.id === activeFileId }"
        @click="activeFileId = file.id"
      >
        <div class="file-item">
          <input
            v-if="editingFileId === file.id"
            v-model="editingFileName"
            @blur="handleFileNameBlur(file.id)"
            @keyup.enter="handleFileNameBlur(file.id)"
            @click.stop
            autofocus
          />
          <span v-else @dblclick="startEditingFileName(file)">
            {{ file.name }}
          </span>
          <div class="actions">
            <button @click.stop="exportFile(file.id)">导出</button>
            <button @click.stop="deleteFile(file.id)">删除</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFileSystem } from '@/composables/useFileSystem'

const {
  files,
  activeFileId,
  createNewFile,
  deleteFile,
  updateFileName,
  importFromLocal,
  exportToLocal
} = useFileSystem()

const editingFileId = ref<string | null>(null)
const editingFileName = ref('')

const startEditingFileName = (file: any) => {
  editingFileId.value = file.id
  editingFileName.value = file.name
}

const handleFileNameBlur = (id: string) => {
  if (editingFileName.value.trim()) {
    updateFileName(id, editingFileName.value)
  }
  editingFileId.value = null
}

const handleFileImport = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    await importFromLocal(input.files[0])
    input.value = '' // 重置input，允许重复选择同一文件
  }
}

const exportFile = (id: string) => {
  exportToLocal(id)
}
</script>

<style scoped>
.file-explorer {
  width: 250px;
  height: 100%;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.toolbar {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  display: flex;
  gap: 10px;
}

.toolbar button, .import-btn {
  padding: 5px 10px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.file-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;
}

.file-list li {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.file-list li.active {
  background-color: #e0e0e0;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-item input {
  width: 100%;
  padding: 2px 5px;
}

.actions {
  display: flex;
  gap: 5px;
}

.actions button {
  padding: 2px 5px;
  font-size: 12px;
}
</style>
