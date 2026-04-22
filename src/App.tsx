import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import RequireAuth from '@/components/ui/RequireAuth'
import Home from '@/pages/Home'
import PostDetail from '@/pages/PostDetail'
import Editor from '@/pages/Editor'
import Dashboard from '@/pages/Dashboard'
import Archives from '@/pages/Archives'
import About from '@/pages/About'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'post/:slug', element: <PostDetail /> },
      {
        path: 'dashboard',
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      { path: 'archives', element: <Archives /> },
      { path: 'about', element: <About /> },
      { path: 'login', element: <Login /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/editor/:id',
    element: (
      <RequireAuth>
        <Editor />
      </RequireAuth>
    ),
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
