import { Link } from 'react-router-dom'
import { BookOpen, GitFork, AtSign, Rss } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <BookOpen className="w-5 h-5 text-blue-400" />
              DevBlog
            </div>
            <p className="text-sm leading-relaxed">
              分享技术见解，记录成长历程。专注于前端、后端与全栈开发实践。
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">快速导航</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link to="/archives" className="hover:text-white transition-colors">
                  归档
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  写文章
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  关于
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">社交媒体</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
              >
                <GitFork className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
              >
                <AtSign className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
              >
                <Rss className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-sm text-center">
          © {new Date().getFullYear()} DevBlog. Built with React + Vite + TailwindCSS.
        </div>
      </div>
    </footer>
  )
}
