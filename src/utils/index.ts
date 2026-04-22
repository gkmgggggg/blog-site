export function nanoid(): string {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36)
}

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[\s\u4e00-\u9fa5]+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '') || `post-${Date.now()}`
  )
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatRelativeDate(dateStr: string): string {
  const now = Date.now()
  const diff = now - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days} 天前`
  if (days < 30) return `${Math.floor(days / 7)} 周前`
  if (days < 365) return `${Math.floor(days / 30)} 个月前`
  return `${Math.floor(days / 365)} 年前`
}
