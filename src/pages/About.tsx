import { Link } from 'react-router-dom'
import { GitFork, AtSign, Mail, BookOpen } from 'lucide-react'
import { useBlogStore } from '@/store/blogStore'
import { defaultAuthor } from '@/data/mockData'

export default function About() {
  const posts = useBlogStore((s) => s.posts)
  const published = posts.filter((p) => p.status === 'published')
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0)

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <img
          src={defaultAuthor.avatar}
          alt={defaultAuthor.name}
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
        />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{defaultAuthor.name}</h1>
        <p className="text-gray-500 text-lg">{defaultAuthor.bio}</p>

        <div className="flex justify-center gap-3 mt-5">
          <a href="#" className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-600">
            <GitFork className="w-5 h-5" />
          </a>
          <a href="#" className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-600">
            <AtSign className="w-5 h-5" />
          </a>
          <a href="#" className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-600">
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-12">
        {[
          { label: '发布文章', value: published.length },
          { label: '总阅读量', value: totalViews.toLocaleString() },
          { label: '写作天数', value: '365+' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 text-center border border-gray-100 shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-1">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">关于本站</h2>
        <div className="prose prose-slate max-w-none text-gray-600">
          <p>这是一个专注于技术分享的个人博客，记录在软件开发过程中的实践经验、学习心得和技术探索。</p>
          <p className="mt-3">博客涵盖以下主题：</p>
          <ul className="mt-2 space-y-1">
            <li>前端开发（React、Vue、TypeScript）</li>
            <li>后端开发（Node.js、数据库优化）</li>
            <li>开发工具与效率提升</li>
            <li>软件架构与设计模式</li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          阅读文章
        </Link>
      </div>
    </div>
  )
}
