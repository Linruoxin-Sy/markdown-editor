// 声明 markdown-it-incremental-dom 模块
declare module 'markdown-it-incremental-dom'

// 扩展 MarkdownIt 接口以包含 renderToIncrementalDOM 方法
declare module 'markdown-it' {
  interface MarkdownIt {
    renderToIncrementalDOM: (src: string) => () => void
  }
}
