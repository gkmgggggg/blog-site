import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, Send, ArrowLeft, Eye, Loader2, X, Plus } from 'lucide-react'
import { useBlogStore } from '@/store/blogStore'
import { postsApi } from '@/api/posts'
import { ApiError } from '@/api/client'
import { useAuthStore } from '@/store/authStore'
import RichEditor from '@/components/editor/RichEditor'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { slugify } from '@/utils'
import { categories } from '@/data/mockData'
import type { Post } from '@/types'

export default function Editor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  const { createPost, updatePost } = useBlogStore()

  const [loadingPost, setLoadingPost] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [currentId, setCurrentId] = useState<string | null>(isNew ? null : id!)

  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: categories[0],
    tags: [] as string[],
    status: 'draft' as Post['status'],
    slug: '',
  })

  // 编辑模式：从 API 加载文章
  useEffect(() => {
    if (isNew || !id) return
    setLoadingPost(true)
    postsApi.getById(id)
      .then((post) => {
        setForm({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage || '',
          category: post.category,
          tags: post.tags,
          status: post.status,
          slug: post.slug,
        })
        setCurrentId(post.id)
        setLoadingPost(false)
      })
      .catch(() => setLoadingPost(false))
  }, [id, isNew])

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function addTag() {
    const t = tagInput.trim()
    if (t && !form.tags.includes(t)) setField('tags', [...form.tags, t])
    setTagInput('')
  }

  async function save(status: Post['status']) {
    if (!form.title.trim()) { setSaveError('请填写文章标题'); return }
    if (!isLoggedIn) { navigate('/login', { state: { from: location.pathname } }); return }

    setSaving(true)
    setSaveError('')
    try {
      const data = { ...form, status, slug: form.slug || slugify(form.title) }

      if (isNew) {
        const post = await createPost(data)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
        navigate(`/editor/${post.id}`, { replace: true })
        setCurrentId(post.id)
      } else if (currentId) {
        await updatePost(currentId, data)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        navigate('/login', { state: { from: location.pathname } })
      } else {
        setSaveError((e as Error).message || '保存失败')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loadingPost) return <LoadingSpinner text="加载文章中..." />

  const wordCount = form.content.replace(/<[^>]+>/g, '').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <input
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="文章标题..."
              className="w-full text-lg font-semibold text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-gray-400 hidden sm:block">{wordCount} 字</span>
            {saved && <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">已保存</span>}
            {saveError && <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full max-w-32 truncate">{saveError}</span>}

            <button
              onClick={() => form.slug && navigate(`/post/${form.slug || slugify(form.title)}`)}
              disabled={isNew}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30"
              title="预览"
            >
              <Eye className="w-5 h-5" />
            </button>

            <button
              onClick={() => save('draft')}
              disabled={saving}
              className="flex items-center gap-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span className="hidden sm:inline">保存草稿</span>
            </button>

            <button
              onClick={() => save('published')}
              disabled={saving}
              className="flex items-center gap-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span className="hidden sm:inline">发布文章</span>
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0 space-y-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">摘要</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setField('excerpt', e.target.value)}
                placeholder="简短描述文章内容..."
                rows={3}
                className="w-full text-sm text-gray-700 placeholder-gray-400 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <RichEditor content={form.content} onChange={(html) => setField('content', html)} placeholder="开始写你的文章..." />
          </div>

          <aside className="w-full lg:w-72 shrink-0 space-y-4">
            {/* Status */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">发布状态</h3>
              <div className="flex gap-2">
                {(['draft', 'published'] as const).map((s) => (
                  <button key={s} onClick={() => setField('status', s)}
                    className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                      form.status === s
                        ? s === 'published' ? 'bg-blue-600 text-white border-blue-600' : 'bg-orange-50 text-orange-600 border-orange-300'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {s === 'draft' ? '草稿' : '已发布'}
                  </button>
                ))}
              </div>
            </div>

            {/* Cover */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">封面图片</h3>
              {form.coverImage && (
                <div className="relative mb-3">
                  <img src={form.coverImage} alt="封面" className="w-full h-32 object-cover rounded-lg" />
                  <button onClick={() => setField('coverImage', '')} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <input
                value={form.coverImage}
                onChange={(e) => setField('coverImage', e.target.value)}
                placeholder="输入图片 URL..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">分类</h3>
              <select value={form.category} onChange={(e) => setField('category', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">标签</h3>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {form.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                    {tag}
                    <button onClick={() => setField('tags', form.tags.filter((t) => t !== tag))} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                  placeholder="添加标签..."
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={addTag} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slug */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">URL Slug</h3>
              <input
                value={form.slug}
                onChange={(e) => setField('slug', e.target.value)}
                placeholder={form.title ? slugify(form.title) : 'post-slug'}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <p className="text-xs text-gray-400 mt-1">留空则自动生成</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
