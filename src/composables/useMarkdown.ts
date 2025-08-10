import { ref, watchEffect } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

export function useMarkdown(initialContent: string) {
  const content = ref(initialContent)
  const htmlContent = ref('')

  // 配置marked
  marked.setOptions({
    highlight: (code, lang) => {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
    breaks: true,
    gfm: true,
  })

  // 更新HTML内容
  watchEffect(() => {
    htmlContent.value = marked(content.value)
  })

  return {
    content,
    htmlContent,
  }
}
