import { marked } from 'marked';

/** Chuyển một trường markdown (từ CMS) thành HTML lúc build. */
export function md(text?: string): string {
  if (!text) return '';
  return marked.parse(text, { async: false, gfm: true, breaks: true }) as string;
}
