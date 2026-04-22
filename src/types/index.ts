export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  author: Author
  tags: string[]
  category: string
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
  publishedAt?: string
  readingTime: number
  views: number
}

export interface Author {
  id: string
  name: string
  avatar: string
  bio: string
}

export interface Category {
  id: string
  name: string
  slug: string
  count: number
}

export type PostFormData = Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'readingTime'>
