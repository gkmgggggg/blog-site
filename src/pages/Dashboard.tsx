import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PenSquare, Edit, Trash2, Eye, EyeOff, Clock, BarChart2, FileText, Send } from 'lucide-react'
import { useBlogStore } from '@/store/blogStore'
import { formatRelativeDate } from '@/utils'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function Dashboard() {
  const [tab, setTab] = useState<'all' | 'published' | 'draft'>('all')
  const { posts, loading, stats, fetchAllPosts, fetchStats, deletePost, publishPost, unpublishPost } = useBlogStore()

  useEffect(() => {
    fetchAllPosts()
    fetchStats()
  }, [fetchAllPosts, fetchStats])

  const filtered = posts.filter((p) => tab === 'all' || p.status === tab)
  const publishedCount = stats?.publishedCount ?? posts.filter((p) => p.status === 'published').length
  const draftCount = stats?.draftCount ?? posts.filter((p) => p.status === 'draft').length
  const totalViews = stats?.totalViews ?? posts.reduce((sum, p) => sum + p.views, 0)

  async function handleDelete(id: string, title: string) {
    if (confirm(`确定要删除《${title}》吗？此操作不可撤销。`)) {
      await deletePost(id)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">文章管理</h1>
          <p className="text-gray-500 mt-1">管理你的所有文章</p>
        </div>
        <Link to="/editor/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors">
          <PenSquare className="w-4 h-4" />写新文章
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: '全部文章', value: stats?.totalPosts ?? posts.length, icon: FileText, color: 'blue' },
          { label: '已发布', value: publishedCount, icon: Send, color: 'green' },
          { label: '草稿', value: draftCount, icon: Clock, color: 'orange' },
          { label: '总阅读量', value: totalViews.toLocaleString(), icon: BarChart2, color: 'purple' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
              stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
              stat.color === 'green' ? 'bg-green-50 text-green-600' :
              stat.color === 'orange' ? 'bg-orange-50 text-orange-600' :
              'bg-purple-50 text-purple-600'
            }`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {([['all', '全部'], ['published', '已发布'], ['draft', '草稿']] as const).map(([val, label]) => (
          <button key={val} onClick={() => setTab(val)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === val ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
            <span className={`ml-1.5 text-xs ${tab === val ? 'text-blue-600' : 'text-gray-400'}`}>
              {val === 'all' ? (stats?.totalPosts ?? posts.length) : val === 'published' ? publishedCount : draftCount}
            </span>
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>暂无文章</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((post) => (
              <div key={post.id} className="p-4 hover:bg-gray-50 transition-colors group">
                <div className="flex items-start gap-4">
                  {post.coverImage && (
                    <img src={post.coverImage} alt="" className="w-16 h-16 object-cover rounded-lg shrink-0 hidden sm:block" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
                      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${
                        post.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                      }`}>
                        {post.status === 'published' ? '已发布' : '草稿'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">{post.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full">{post.category}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readingTime} 分钟</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views.toLocaleString()}</span>
                      <span>更新于 {formatRelativeDate(post.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to={`/editor/${post.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="编辑">
                      <Edit className="w-4 h-4" />
                    </Link>

                    {post.status === 'draft' ? (
                      <button onClick={() => publishPost(post.id)} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="发布">
                        <Send className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={() => unpublishPost(post.id)} className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="取消发布">
                        <EyeOff className="w-4 h-4" />
                      </button>
                    )}

                    {post.status === 'published' && (
                      <Link to={`/post/${post.slug}`} className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="查看">
                        <Eye className="w-4 h-4" />
                      </Link>
                    )}

                    <button onClick={() => handleDelete(post.id, post.title)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="删除">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
