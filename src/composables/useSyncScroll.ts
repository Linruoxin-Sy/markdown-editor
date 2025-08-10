import { onMounted, onUnmounted, type Ref } from 'vue'

export function useSyncScroll(
  editorRef: Ref<HTMLElement | null>,
  previewRef: Ref<HTMLElement | null>,
) {
  let isUserScroll = true

  const syncScroll = (source: HTMLElement, target: HTMLElement) => {
    if (!isUserScroll) return

    isUserScroll = false

    const sourceScrollRatio = source.scrollTop / (source.scrollHeight - source.clientHeight)
    const targetScrollTop = sourceScrollRatio * (target.scrollHeight - target.clientHeight)

    target.scrollTo({
      top: targetScrollTop,
      behavior: 'auto',
    })

    setTimeout(() => {
      isUserScroll = true
    }, 100)
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
      editorRef.value.addEventListener('scroll', onEditorScroll)
      previewRef.value.addEventListener('scroll', onPreviewScroll)
    }
  })

  onUnmounted(() => {
    if (editorRef.value && previewRef.value) {
      editorRef.value.removeEventListener('scroll', onEditorScroll)
      previewRef.value.removeEventListener('scroll', onPreviewScroll)
    }
  })
}
