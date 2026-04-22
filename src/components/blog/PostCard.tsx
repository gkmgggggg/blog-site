import { Link } from 'react-router-dom'
import { Clock, Eye, Tag } from 'lucide-react'
import type { Post } from '@/types'
import { formatRelativeDate } from '@/utils'

interface Props {
  post: Post
  featured?: boolean
}

export default function PostCard({ post, featured = false }: Props) {
  return (
    <article className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 ${featured ? 'md:col-span-2' : ''}`}>
      {post.coverImage && (
        <Link to={`/post/${post.slug}`} className="block overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${featured ? 'h-64' : 'h-48'}`}
          />
        </Link>
      )}
      <div className="p-5">
        {/* Category & Tags */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            {post.category}
          </span>
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <Link to={`/post/${post.slug}`}>
          <h2 className={`font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 ${featured ? 'text-2xl' : 'text-lg'}`}>
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full" />
            <span>{post.author.name}</span>
            <span>·</span>
            <span>{formatRelativeDate(post.publishedAt || post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readingTime} 分钟
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {post.views.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
