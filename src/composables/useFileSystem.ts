import { ref, computed } from 'vue'
import type { MarkdownFile } from '@/types'

export function useFileSystem() {
  const files = ref<MarkdownFile[]>([])
  const activeFileId = ref<string | null>(null)

  // 从本地存储加载文件
  const loadFromLocalStorage = () => {
    const savedFiles = localStorage.getItem('markdown-files')
    if (savedFiles) {
      files.value = JSON.parse(savedFiles)
    }
  }

  // 保存到本地存储
  const saveToLocalStorage = () => {
    localStorage.setItem('markdown-files', JSON.stringify(files.value))
  }

  // 当前活动文件
  const activeFile = computed(() => files.value.find((file) => file.id === activeFileId.value))

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
    files.value = files.value.filter((file) => file.id !== id)
    if (activeFileId.value === id) {
      activeFileId.value = files.value[0]?.id || null
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
  if (files.value.length === 0) {
    createNewFile()
  } else {
    activeFileId.value = files.value[0].id
  }

  return {
    files,
    activeFileId,
    activeFile,
    createNewFile,
    deleteFile,
    updateFileName,
    updateFileContent,
    importFromLocal,
    exportToLocal,
  }
}
