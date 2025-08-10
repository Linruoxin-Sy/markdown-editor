<template>
  <div ref="container" class="preview"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { patch } from 'incremental-dom'
import md from '@/utils/markdown'

const container = ref<HTMLElement | null>(null)

// 接收 content 属性
const props = defineProps({
  content: {
    type: String,
    required: true,
  },
})

function render() {
  if (!container.value) return

  const func = md.renderToIncrementalDOM(props.content)

  patch(container.value as HTMLElement, func)
}

watch(() => props.content, render, { immediate: true })
onMounted(render)
</script>

<style scoped>
.preview {
  /* 变量 */
  --ld-transition-duration: 0.3s;
  --ld-code-header-height: 40px;
  /* 白天模式默认变量 */
  --ld-color-primary: #f5f5f5;
  --ld-color-btn: #f7f7f7;
  --ld-color-btn-hover: #eaeaea;
  --ld-color-border: #e6e6e6;
  --ld-color-text: #333333;
  --ld-color-bg: #ffffff;
  --ld-color-bg-hover: #f5f5f5;
  --ld-color-input-bg: #fff;
  --ld-color-code-bg: #f7f7f7;
  width: 100%;
  height: 100%;
  padding: 32px;
  overflow-y: auto;
  border-left: 1px solid #ddd;
  color: var(--ld-color-text);
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.7;
  font-size: 16px;
}

/* 标题样式 */
.preview :deep(h1) {
  font-size: 2.5em;
  font-weight: 700;
  margin: 48px 0 24px;
  border-bottom: 3px solid var(--ld-color-primary);
  padding-bottom: 12px;
  color: #2c3e50;
}

.preview :deep(h2) {
  font-size: 2em;
  font-weight: 600;
  margin: 40px 0 20px;
  border-bottom: 2px solid var(--ld-color-border);
  padding-bottom: 8px;
  color: #34495e;
}

.preview :deep(h3) {
  font-size: 1.5em;
  font-weight: 600;
  margin: 32px 0 16px;
  color: #34495e;
}

.preview :deep(h4, h5, h6) {
  font-size: 1.25em;
  font-weight: 600;
  margin: 24px 0 12px;
  color: #34495e;
}

/* 段落样式 */
.preview :deep(p) {
  width: 100%;
  margin: 16px 0;
  transition: color var(--ld-transition-duration);
}

/* 链接样式 */
.preview :deep(a) {
  color: #3498db;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}

.preview :deep(a:hover) {
  color: #2980b9;
  border-bottom-color: #3498db;
}

/* 表格样式 */
.preview :deep(table) {
  width: 100%;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin: 24px 0;
}

.preview :deep(table),
.preview :deep(table th),
.preview :deep(table td) {
  border: 1px solid var(--ld-color-border);
}

.preview :deep(table th) {
  background-color: #f8f9fa;
  color: #495057;
  padding: 16px;
  font-weight: 600;
  text-align: left;
}

.preview :deep(table td) {
  padding: 14px 16px;
  color: var(--ld-color-text);
}

.preview :deep(table tr:nth-child(even)) {
  background-color: #f8f9fa;
}

.preview :deep(table tr:hover) {
  background-color: var(--ld-color-bg-hover);
  transition: background-color var(--ld-transition-duration);
}

/* 引用样式 */
.preview :deep(blockquote) {
  border-left: 4px solid #3498db;
  padding: 20px 24px;
  margin: 24px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 0 8px 8px 0;
  position: relative;
  font-style: italic;
}

.preview :deep(blockquote::before) {
  content: '"';
  font-size: 4em;
  color: #3498db;
  position: absolute;
  left: 12px;
  top: -10px;
  font-family: Georgia, serif;
  opacity: 0.3;
}

.preview :deep(blockquote p) {
  margin: 0;
  padding: 0;
  color: #555;
  font-size: 1.1em;
}

/* 代码样式 */
.preview :deep(code) {
  background-color: #f1f3f4;
  color: #e74c3c;
  padding: 4px 8px;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  font-weight: 600;
}

.preview :deep(pre) {
  padding: 24px;
  margin: 24px 0;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow-x: auto;
  position: relative;
}

.preview :deep(pre code) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: transparent;
  color: #495057;
  font-size: 14px;
  line-height: 1.6;
  padding: 0;
}

/* 列表样式 */
.preview :deep(ul, ol) {
  margin: 16px 0;
  padding-left: 32px;
}

.preview :deep(li) {
  margin: 8px 0;
  line-height: 1.6;
}

.preview :deep(ul li) {
  list-style-type: none;
  position: relative;
}

.preview :deep(ul li::before) {
  content: '•';
  color: #3498db;
  font-size: 1.2em;
  position: absolute;
  left: -20px;
  top: -4px;
}

.preview :deep(ol li::marker) {
  color: #3498db;
  font-weight: 600;
}

/* 分隔线样式 */
.preview :deep(hr) {
  border: none;
  height: 2px;
  background: linear-gradient(90deg, transparent, #3498db, transparent);
  margin: 32px 0;
}

/* 图片样式 */
.preview :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 16px 0;
  transition: transform 0.3s ease;
}

.preview :deep(img:hover) {
  transform: scale(1.02);
}

/* 代码块样式 */
.preview :deep(.code-block) {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e9ecef;
  margin: 24px 0;
}
</style>
