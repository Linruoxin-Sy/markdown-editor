import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import MarkdownItIncrementalDOM from 'markdown-it-incremental-dom'
import * as IncrementalDOM from 'incremental-dom'
import 'highlight.js/styles/github.css'

// 创建 Markdown 解析器实例
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MarkdownItConstructor = MarkdownIt as any
const md = new MarkdownItConstructor({
  html: true, // 允许 HTML 标签
  linkify: true, // 自动转换 URL 为链接
  typographer: true, // 优化排版
  highlight: (str: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`
      } catch (e) {
        console.error(e)
      }
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  },
})

// 解析后增量渲染 Markdown 内容
md.use(MarkdownItIncrementalDOM, IncrementalDOM)

export default md
