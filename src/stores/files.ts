import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { MarkdownFile } from '@/types/types'

export const useFileStore = defineStore('files', () => {
  const files = ref<MarkdownFile[]>([])
  const activeFileId = ref<string | null>(null)

  // 从本地存储加载文件
  const loadFromLocalStorage = () => {
    const savedFiles = localStorage.getItem('markdown-files')
    const id = localStorage.getItem('active-file-id')
      ? localStorage.getItem('active-file-id')
      : null
    if (savedFiles) {
      files.value = JSON.parse(savedFiles)
    }
    if (files.value.length === 0) {
      createNewFile()
    }
    if (id) {
      activeFileId.value = id
    } else {
      activeFileId.value = files.value[0]?.id || null
    }
  }

  // 保存到本地存储
  const saveToLocalStorage = () => {
    localStorage.setItem('markdown-files', JSON.stringify(files.value))
    localStorage.setItem('active-file-id', activeFileId.value ? activeFileId.value : '')
  }

  // 当前活动文件
  const activeFile = computed(() => files.value.find((file) => file.id === activeFileId.value))

  // 切换活动文件
  const setActiveFile = (id: string | null) => {
    activeFileId.value = id
    saveToLocalStorage()
  }

  // 创建新文件
  const createNewFile = () => {
    const newFile: MarkdownFile = {
      id: Date.now().toString(),
      name: `未命名-${files.value.length + 1}.md`,
      content: '# 新文档',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    files.value.push(newFile)
    activeFileId.value = newFile.id
    saveToLocalStorage()
    return newFile
  }

  // 删除文件
  const deleteFile = (id: string) => {
    const fileIndex = files.value.findIndex((file) => file.id === id)
    if (fileIndex === -1) return // 文件不存在，直接返回

    files.value = files.value.filter((file) => file.id !== id)

    // 如果删除的是当前活动文件，需要选择新的活动文件
    if (activeFileId.value === id) {
      if (files.value.length > 0) {
        // 优先选择删除文件后面的文件，如果没有就选择前面的
        const nextFile = files.value[Math.min(fileIndex, files.value.length - 1)]
        activeFileId.value = nextFile.id
      } else {
        activeFileId.value = null
      }
    }

    saveToLocalStorage()
  }

  // 更新文件名
  const updateFileName = (id: string, newName: string) => {
    const file = files.value.find((f) => f.id === id)
    if (file) {
      file.name = newName
      file.updatedAt = Date.now()
      saveToLocalStorage()
    }
  }

  // 更新文件内容
  const updateFileContent = (id: string, content: string) => {
    const file = files.value.find((f) => f.id === id)
    if (file) {
      file.content = content
      file.updatedAt = Date.now()
      saveToLocalStorage()
    }
  }

  // 从本地导入文件
  const importFromLocal = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const newFile: MarkdownFile = {
          id: Date.now().toString(),
          name: file.name,
          content,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }

        files.value.push(newFile)
        activeFileId.value = newFile.id
        saveToLocalStorage()
        resolve()
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  // 导出到本地
  const exportToLocal = (id: string) => {
    const file = files.value.find((f) => f.id === id)
    if (!file) return

    const blob = new Blob([file.content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    a.click()
    URL.revokeObjectURL(url)
  }

  // 初始化
  loadFromLocalStorage()

  return {
    files,
    activeFileId,
    activeFile,
    setActiveFile,
    createNewFile,
    deleteFile,
    updateFileName,
    updateFileContent,
    importFromLocal,
    exportToLocal,
  }
})
