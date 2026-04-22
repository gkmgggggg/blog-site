import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Post, PostFormData } from '@/types'
import { initialPosts, defaultAuthor } from '@/data/mockData'
import { nanoid } from '@/utils'

interface BlogStore {
  posts: Post[]
  searchQuery: string
  selectedTag: string
  selectedCategory: string
  setSearchQuery: (q: string) => void
  setSelectedTag: (tag: string) => void
  setSelectedCategory: (cat: string) => void
  getPost: (slug: string) => Post | undefined
  createPost: (data: PostFormData) => Post
  updatePost: (id: string, data: Partial<PostFormData>) => void
  deletePost: (id: string) => void
  publishPost: (id: string) => void
  unpublishPost: (id: string) => void
  incrementViews: (id: string) => void
  getAllTags: () => string[]
  getFilteredPosts: (status?: 'published' | 'draft') => Post[]
}

function calcReadingTime(content: string): number {
  const text = content.replace(/<[^>]+>/g, '')
  const words = text.length
  return Math.max(1, Math.ceil(words / 300))
}

export const useBlogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      posts: initialPosts,
      searchQuery: '',
      selectedTag: '',
      selectedCategory: '',

      setSearchQuery: (q) => set({ searchQuery: q }),
      setSelectedTag: (tag) => set({ selectedTag: tag }),
      setSelectedCategory: (cat) => set({ selectedCategory: cat }),

      getPost: (slug) => get().posts.find((p) => p.slug === slug),

      createPost: (data) => {
        const now = new Date().toISOString()
        const post: Post = {
          ...data,
          id: nanoid(),
          author: defaultAuthor,
          createdAt: now,
          updatedAt: now,
          publishedAt: data.status === 'published' ? now : undefined,
          readingTime: calcReadingTime(data.content),
          views: 0,
        }
        set((s) => ({ posts: [post, ...s.posts] }))
        return post
      },

      updatePost: (id, data) => {
        set((s) => ({
          posts: s.posts.map((p) => {
            if (p.id !== id) return p
            const now = new Date().toISOString()
            return {
              ...p,
              ...data,
              updatedAt: now,
              publishedAt:
                data.status === 'published' && p.status !== 'published'
                  ? now
                  : p.publishedAt,
              readingTime: data.content ? calcReadingTime(data.content) : p.readingTime,
            }
          }),
        }))
      },

      deletePost: (id) => set((s) => ({ posts: s.posts.filter((p) => p.id !== id) })),

      publishPost: (id) => {
        const now = new Date().toISOString()
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === id ? { ...p, status: 'published', publishedAt: now, updatedAt: now } : p
          ),
        }))
      },

      unpublishPost: (id) => {
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === id
              ? { ...p, status: 'draft', publishedAt: undefined, updatedAt: new Date().toISOString() }
              : p
          ),
        }))
      },

      incrementViews: (id) => {
        set((s) => ({
          posts: s.posts.map((p) => (p.id === id ? { ...p, views: p.views + 1 } : p)),
        }))
      },

      getAllTags: () => {
        const tags = new Set<string>()
        get().posts.forEach((p) => p.tags.forEach((t) => tags.add(t)))
        return Array.from(tags)
      },

      getFilteredPosts: (status) => {
        const { posts, searchQuery, selectedTag, selectedCategory } = get()
        return posts.filter((p) => {
          if (status && p.status !== status) return false
          if (
            searchQuery &&
            !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
          )
            return false
          if (selectedTag && !p.tags.includes(selectedTag)) return false
          if (selectedCategory && p.category !== selectedCategory) return false
          return true
        })
      },
    }),
    { name: 'blog-store' }
  )
)
