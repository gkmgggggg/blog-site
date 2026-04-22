import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PenSquare, Search, Menu, X, BookOpen } from 'lucide-react'
import { useBlogStore } from '@/store/blogStore'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const setSearchQuery = useBlogStore((s) => s.setSearchQuery)
  const navigate = useNavigate()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearchQuery(searchVal)
    navigate(`/?search=${encodeURIComponent(searchVal)}`)
    setSearchOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:text-blue-600 transition-colors">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <span>DevBlog</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">首页</Link>
          <Link to="/archives" className="hover:text-blue-600 transition-colors">归档</Link>
          <Link to="/about" className="hover:text-blue-600 transition-colors">关于</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                autoFocus
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="搜索文章..."
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
          )}

          <Link
            to="/dashboard"
            className="hidden md:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <PenSquare className="w-4 h-4" />
            写文章
          </Link>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-500 hover:text-gray-700">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-blue-600">首页</Link>
          <Link to="/archives" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-blue-600">归档</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-blue-600">关于</Link>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block py-2 text-blue-600 font-medium">写文章</Link>
        </div>
      )}
    </header>
  )
}
