import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-black text-gray-100 mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">页面不存在</h1>
      <p className="text-gray-500 mb-8">您访问的页面可能已被删除或链接有误</p>
      <div className="flex gap-3">
        <button onClick={() => history.back()} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />返回上页
        </button>
        <Link to="/" className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm">
          <Home className="w-4 h-4" />回到首页
        </Link>
      </div>
    </div>
  )
}
