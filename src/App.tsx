import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'
import PostDetail from '@/pages/PostDetail'
import Editor from '@/pages/Editor'
import Dashboard from '@/pages/Dashboard'
import Archives from '@/pages/Archives'
import About from '@/pages/About'
import NotFound from '@/pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'post/:slug', element: <PostDetail /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'archives', element: <Archives /> },
      { path: 'about', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/editor/:id',
    element: <Editor />,
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
