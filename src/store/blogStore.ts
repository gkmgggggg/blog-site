import { create } from 'zustand'
import type { Post } from '@/types'
import { postsApi } from '@/api/posts'
import type { PostsQuery, StatsResponse } from '@/api/posts'

interface BlogStore {
  // 文章数据
  posts: Post[]
  totalPosts: number
  loading: boolean
  error: string | null

  // 筛选状态（本地）
  searchQuery: string
  selectedTag: string
  selectedCategory: string

  // 标签
  tags: { tag: string; count: number }[]

  // 统计
  stats: StatsResponse | null

  // 筛选 actions
  setSearchQuery: (q: string) => void
  setSelectedTag: (tag: string) => void
  setSelectedCategory: (cat: string) => void

  // 数据获取
  fetchPosts: (query?: PostsQuery) => Promise<void>
  fetchAllPosts: () => Promise<void>
  fetchTags: () => Promise<void>
  fetchStats: () => Promise<void>

  // CRUD
  createPost: (data: Partial<Post>) => Promise<Post>
  updatePost: (id: string, data: Partial<Post>) => Promise<Post>
  deletePost: (id: string) => Promise<void>
  publishPost: (id: string) => Promise<void>
  unpublishPost: (id: string) => Promise<void>
  incrementViews: (id: string) => Promise<void>
}

export const useBlogStore = create<BlogStore>()((set) => ({
  posts: [],
  totalPosts: 0,
  loading: false,
  error: null,
  searchQuery: '',
  selectedTag: '',
  selectedCategory: '',
  tags: [],
  stats: null,

  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedTag: (tag) => set({ selectedTag: tag }),
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),

  fetchPosts: async (query = {}) => {
    set({ loading: true, error: null })
    try {
      const { posts, meta } = await postsApi.list(query)
      set({ posts, totalPosts: meta.total, loading: false })
    } catch (e) {
      set({ error: (e as Error).message, loading: false })
    }
  },

  fetchAllPosts: async () => {
    set({ loading: true, error: null })
    try {
      const { posts, meta } = await postsApi.list({ pageSize: 100 })
      set({ posts, totalPosts: meta.total, loading: false })
    } catch (e) {
      set({ error: (e as Error).message, loading: false })
    }
  },

  fetchTags: async () => {
    try {
      const tags = await postsApi.tags()
      set({ tags })
    } catch {}
  },

  fetchStats: async () => {
    try {
      const stats = await postsApi.stats()
      set({ stats })
    } catch {}
  },

  createPost: async (data) => {
    const post = await postsApi.create(data)
    set((s) => ({ posts: [post, ...s.posts] }))
    return post
  },

  updatePost: async (id, data) => {
    const post = await postsApi.update(id, data)
    set((s) => ({ posts: s.posts.map((p) => (p.id === id ? post : p)) }))
    return post
  },

  deletePost: async (id) => {
    await postsApi.delete(id)
    set((s) => ({ posts: s.posts.filter((p) => p.id !== id) }))
  },

  publishPost: async (id) => {
    const post = await postsApi.publish(id)
    set((s) => ({ posts: s.posts.map((p) => (p.id === id ? post : p)) }))
  },

  unpublishPost: async (id) => {
    const post = await postsApi.unpublish(id)
    set((s) => ({ posts: s.posts.map((p) => (p.id === id ? post : p)) }))
  },

  incrementViews: async (id) => {
    try {
      await postsApi.incrementViews(id)
    } catch {}
  },
}))
