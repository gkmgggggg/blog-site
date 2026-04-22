import { useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, X, TrendingUp } from 'lucide-react'
import { useBlogStore } from '@/store/blogStore'
import PostCard from '@/components/blog/PostCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    posts, loading, error,
    searchQuery, selectedTag, selectedCategory, tags,
    setSearchQuery, setSelectedTag, setSelectedCategory,
    fetchPosts, fetchTags,
  } = useBlogStore()

  // 仅在 mount 时将 URL 参数同步到 store（避免与 fetch effect 级联）
  const didMount = useRef(false)
  useEffect(() => {
    if (didMount.current) return
    didMount.current = true
    const q = searchParams.get('search') || ''
    if (q) setSearchQuery(q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 筛选条件变化时重新拉取，fetchPosts 是 Zustand 稳定引用，不会额外触发
  useEffect(() => {
    fetchPosts({
      status: 'published',
      search: searchQuery || undefined,
      tag: selectedTag || undefined,
      category: selectedCategory || undefined,
    })
  }, [searchQuery, selectedTag, selectedCategory, fetchPosts])

  // 标签只需拉取一次
  useEffect(() => {
    fetchTags()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const featured = posts[0]
  const restPosts = posts.slice(1)
  const hasFilters = searchQuery || selectedTag || selectedCategory

  function clearFilters() {
    setSearchQuery('')
    setSelectedTag('')
    setSelectedCategory('')
    setSearchParams({})
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {!hasFilters && (
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
            探索技术的<span className="text-blue-600">无限可能</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            分享前沿技术见解，记录真实开发实践，与开发者共同成长
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          {hasFilters && (
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {searchQuery && (
                <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-sm px-3 py-1.5 rounded-full">
                  <Search className="w-3.5 h-3.5" />"{searchQuery}"
                </span>
              )}
              {selectedTag && (
                <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 text-sm px-3 py-1.5 rounded-full">
                  #{selectedTag}
                </span>
              )}
              {selectedCategory && (
                <span className="flex items-center gap-1.5 bg-green-50 text-green-700 text-sm px-3 py-1.5 rounded-full">
                  {selectedCategory}
                </span>
              )}
              <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-3.5 h-3.5" />清除筛选
              </button>
              <span className="text-sm text-gray-400 ml-auto">共 {posts.length} 篇</span>
            </div>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-3">{error}</p>
              <button
                onClick={() => fetchPosts({ status: 'published', search: searchQuery || undefined, tag: selectedTag || undefined, category: selectedCategory || undefined })}
                className="text-blue-600 hover:underline text-sm"
              >
                重试
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">未找到相关文章</p>
              {hasFilters && <button onClick={clearFilters} className="mt-3 text-blue-600 hover:underline text-sm">清除筛选</button>}
            </div>
          ) : (
            <>
              {!hasFilters && featured && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-semibold text-orange-500">精选文章</span>
                  </div>
                  <PostCard post={featured} featured />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(hasFilters ? posts : restPosts).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="w-full lg:w-72 shrink-0 space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">搜索文章</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSearchParams(e.target.value ? { search: e.target.value } : {})
                }}
                placeholder="搜索..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {tags.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">标签云</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map(({ tag }) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      selectedTag === tag
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-5 text-white">
            <h3 className="font-bold text-lg mb-2">开始写作</h3>
            <p className="text-blue-100 text-sm mb-4">记录你的技术心得，与社区分享知识。</p>
            <Link to="/editor/new" className="block text-center bg-white text-blue-600 font-semibold text-sm py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
              写新文章
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
