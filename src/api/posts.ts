import type { Post } from '@/types'

export interface PostsQuery {
  page?: number
  pageSize?: number
  status?: 'published' | 'draft'
  tag?: string
  category?: string
  search?: string
}

export interface PostsMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface PostsResponse {
  posts: Post[]
  meta: PostsMeta
}

export interface StatsResponse {
  totalPosts: number
  publishedCount: number
  draftCount: number
  totalViews: number
}

export interface ArchiveYear {
  year: number
  posts: Post[]
}

function token(): string | null {
  return localStorage.getItem('access_token')
}

async function request<T>(url: string, init: RequestInit = {}, auth = false): Promise<T> {
  const t = token()
  const h: Record<string, string> = {}
  if (!(init.body instanceof FormData)) h['Content-Type'] = 'application/json'
  if (auth && t) h['Authorization'] = `Bearer ${t}`

  const res = await fetch(url, {
    ...init,
    headers: { ...h, ...(init.headers as Record<string, string>) },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message || '请求失败')
  return json.data as T
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&')
  return q ? `?${q}` : ''
}

// 将后端 snake_case 字段映射为前端 camelCase
function mapPost(p: Record<string, unknown>): Post {
  const author = p.author as Record<string, unknown> | null
  return {
    id: p.id as string,
    title: p.title as string,
    slug: p.slug as string,
    excerpt: (p.excerpt as string) || '',
    content: (p.content as string) || '',
    coverImage: (p.cover_image as string) || undefined,
    author: author
      ? {
          id: author.id as string,
          name: author.name as string,
          avatar: author.avatar as string,
          bio: (author.bio as string) || '',
        }
      : { id: '', name: '', avatar: '', bio: '' },
    tags: (p.tags as string[]) || [],
    category: p.category as string,
    status: p.status as Post['status'],
    readingTime: (p.reading_time as number) || 1,
    views: (p.views as number) || 0,
    createdAt: (p.created_at as string) || new Date().toISOString(),
    updatedAt: (p.updated_at as string) || new Date().toISOString(),
    publishedAt: (p.published_at as string) || undefined,
  }
}

async function listPosts(query: PostsQuery = {}): Promise<PostsResponse> {
  const q = buildQuery({
    page: query.page,
    page_size: query.pageSize,
    status: query.status,
    tag: query.tag,
    category: query.category,
    search: query.search,
  })
  const t = token()
  const hdrs: Record<string, string> = {}
  if (t) hdrs['Authorization'] = `Bearer ${t}`

  const res = await fetch(`/api/posts${q}`, { headers: hdrs })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message || '请求失败')

  const posts = (json.data as Record<string, unknown>[]).map(mapPost)
  const m = json.meta as Record<string, unknown>
  return {
    posts,
    meta: {
      page: m.page as number,
      pageSize: m.page_size as number,
      total: m.total as number,
      totalPages: m.total_pages as number,
    },
  }
}

export const postsApi = {
  list: listPosts,

  getBySlug: async (slug: string): Promise<Post> => {
    const data = await request<Record<string, unknown>>(`/api/posts/slug/${slug}`)
    return mapPost(data)
  },

  getById: async (id: string): Promise<Post> => {
    const data = await request<Record<string, unknown>>(`/api/posts/${id}`)
    return mapPost(data)
  },

  create: async (data: Partial<Post>): Promise<Post> => {
    const body = {
      title: data.title,
      slug: data.slug || undefined,
      excerpt: data.excerpt || '',
      content: data.content || '',
      cover_image: data.coverImage || null,
      tags: data.tags || [],
      category: data.category,
      status: data.status || 'draft',
    }
    const result = await request<Record<string, unknown>>(
      '/api/posts',
      { method: 'POST', body: JSON.stringify(body) },
      true
    )
    return mapPost(result)
  },

  update: async (id: string, data: Partial<Post>): Promise<Post> => {
    const body: Record<string, unknown> = {}
    if (data.title !== undefined) body.title = data.title
    if (data.slug !== undefined) body.slug = data.slug
    if (data.excerpt !== undefined) body.excerpt = data.excerpt
    if (data.content !== undefined) body.content = data.content
    if (data.coverImage !== undefined) body.cover_image = data.coverImage || null
    if (data.tags !== undefined) body.tags = data.tags
    if (data.category !== undefined) body.category = data.category
    if (data.status !== undefined) body.status = data.status
    const result = await request<Record<string, unknown>>(
      `/api/posts/${id}`,
      { method: 'PUT', body: JSON.stringify(body) },
      true
    )
    return mapPost(result)
  },

  delete: (id: string): Promise<unknown> => request(`/api/posts/${id}`, { method: 'DELETE' }, true),

  publish: async (id: string): Promise<Post> => {
    const result = await request<Record<string, unknown>>(
      `/api/posts/${id}/publish`,
      { method: 'PATCH' },
      true
    )
    return mapPost(result)
  },

  unpublish: async (id: string): Promise<Post> => {
    const result = await request<Record<string, unknown>>(
      `/api/posts/${id}/unpublish`,
      { method: 'PATCH' },
      true
    )
    return mapPost(result)
  },

  incrementViews: (id: string): Promise<{ views: number }> =>
    request(`/api/posts/${id}/views`, { method: 'PATCH' }),

  tags: (): Promise<{ tag: string; count: number }[]> => request('/api/tags'),

  stats: (): Promise<StatsResponse> =>
    request<Record<string, unknown>>('/api/stats').then((d) => ({
      totalPosts: d.total_posts as number,
      publishedCount: d.published_count as number,
      draftCount: d.draft_count as number,
      totalViews: d.total_views as number,
    })),

  archives: (): Promise<ArchiveYear[]> =>
    request<{ year: number; posts: Record<string, unknown>[] }[]>('/api/posts/archives').then(
      (data) => data.map((y) => ({ year: y.year, posts: y.posts.map(mapPost) }))
    ),
}
