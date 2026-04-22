import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { postsApi } from '@/api/posts'
import type { ArchiveYear } from '@/api/posts'
import { formatDate } from '@/utils'
import { Clock, Eye } from 'lucide-react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function Archives() {
  const [archives, setArchives] = useState<ArchiveYear[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    postsApi.archives()
      .then((data) => {
        setArchives(data)
        setTotal(data.reduce((sum, y) => sum + y.posts.length, 0))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">文章归档</h1>
      <p className="text-gray-500 mb-10">共 {total} 篇文章</p>

      <div className="space-y-10">
        {archives.map(({ year, posts }) => (
          <section key={year}>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              {year}
              <span className="text-sm font-normal text-gray-400">{posts.length} 篇</span>
            </h2>
            <div className="space-y-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/post/${post.slug}`}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all group"
                >
                  <span className="text-sm text-gray-400 shrink-0 w-20">
                    {formatDate(post.publishedAt || post.createdAt).slice(5)}
                  </span>
                  <span className="flex-1 font-medium text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                    {post.title}
                  </span>
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full shrink-0 hidden sm:block">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-gray-400 shrink-0">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readingTime}m</span>
                    <span className="flex items-center gap-1 hidden sm:flex"><Eye className="w-3 h-3" />{post.views}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
