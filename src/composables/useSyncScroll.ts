import { onMounted, onUnmounted, type Ref } from 'vue'

export function useSyncScroll(
  editorRef: Ref<HTMLElement | null>,
  previewRef: Ref<HTMLElement | null>,
) {
  let isScroll = false

  const syncScroll = (source: HTMLElement, target: HTMLElement) => {
    if (isScroll) return

    isScroll = true

    const sourceScrollRatio = source.scrollTop / Math.max(source.scrollHeight - source.clientHeight, 1)
    const targetScrollTop = sourceScrollRatio * Math.max(target.scrollHeight - target.clientHeight, 0)

    target.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth',
    })

    const done = () => {
      isScroll = false
      target.removeEventListener('scrollend', done)
    }

    target.addEventListener('scrollend', done)
  }

  const onEditorScroll = () => {
    if (!editorRef.value || !previewRef.value) return
    syncScroll(editorRef.value, previewRef.value)
  }

  const onPreviewScroll = () => {
    if (!editorRef.value || !previewRef.value) return
    syncScroll(previewRef.value, editorRef.value)
  }

  onMounted(() => {
    if (editorRef.value && previewRef.value) {
      editorRef.value.addEventListener('scrollend', onEditorScroll)
      previewRef.value.addEventListener('scrollend', onPreviewScroll)
    }
  })

  onUnmounted(() => {
    if (editorRef.value && previewRef.value) {
      editorRef.value.removeEventListener('scroll', onEditorScroll)
      previewRef.value.removeEventListener('scroll', onPreviewScroll)
    }
  })
}
