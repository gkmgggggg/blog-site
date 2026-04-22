import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Clock, Eye, Tag, ArrowLeft, Edit, Calendar } from 'lucide-react'
import { postsApi } from '@/api/posts'
import { formatDate } from '@/utils'
import type { Post } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [related, setRelated] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    postsApi.getBySlug(slug)
      .then(async (p) => {
        setPost(p)
        setLoading(false)
        // 增加阅读数（fire-and-forget）
        postsApi.incrementViews(p.id).catch(() => {})
        // 获取相关文章
        if (p.tags.length > 0) {
          const { posts } = await postsApi.list({ status: 'published', tag: p.tags[0], pageSize: 4 })
          setRelated(posts.filter((r) => r.id !== p.id).slice(0, 3))
        }
      })
      .catch((e) => { setError(e.message); setLoading(false) })
  }, [slug])

  if (loading) return <LoadingSpinner text="加载文章中..." />

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">文章不存在</h1>
        <p className="text-gray-500 mb-6">{error || '该文章可能已被删除或链接有误'}</p>
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4" />返回首页
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8 transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" />返回
      </button>

      <article>
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{post.category}</span>
            {post.status === 'draft' && (
              <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">草稿</span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>
          <p className="text-xl text-gray-500 leading-relaxed mb-6">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full" />
              <span className="font-medium text-gray-700">{post.author.name}</span>
            </div>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />{post.readingTime} 分钟阅读
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />{post.views.toLocaleString()} 次阅读
            </span>
            <Link to={`/editor/${post.id}`} className="ml-auto flex items-center gap-1.5 text-blue-600 hover:underline">
              <Edit className="w-4 h-4" />编辑文章
            </Link>
          </div>
        </header>

        {post.coverImage && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            <img src={post.coverImage} alt={post.title} className="w-full object-cover max-h-96" />
          </div>
        )}

        <div
          className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-10 pt-6 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/?tag=${tag}`}
                className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 px-3 py-1.5 rounded-full transition-colors"
              >
                <Tag className="w-3.5 h-3.5" />{tag}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 flex items-start gap-4">
          <img src={post.author.avatar} alt={post.author.name} className="w-14 h-14 rounded-full shrink-0" />
          <div>
            <div className="font-semibold text-gray-900 mb-1">{post.author.name}</div>
            <p className="text-gray-600 text-sm">{post.author.bio}</p>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">相关文章</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {related.map((p) => (
              <Link key={p.id} to={`/post/${p.slug}`} className="group bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all">
                {p.coverImage && <img src={p.coverImage} alt={p.title} className="w-full h-32 object-cover rounded-lg mb-3" />}
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm line-clamp-2">{p.title}</h3>
                <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />{p.readingTime} 分钟
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
