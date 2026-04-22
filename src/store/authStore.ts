import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '@/api/auth'

interface AuthStore {
  accessToken: string | null
  refreshToken: string | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,

      login: async (email, password) => {
        const tokens = await authApi.login(email, password)
        localStorage.setItem('access_token', tokens.accessToken)
        set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, isLoggedIn: true })
      },

      logout: async () => {
        const { refreshToken } = get()
        if (refreshToken) await authApi.logout(refreshToken).catch(() => {})
        localStorage.removeItem('access_token')
        set({ accessToken: null, refreshToken: null, isLoggedIn: false })
      },
    }),
    { name: 'auth-store', partialize: (s) => ({ accessToken: s.accessToken, refreshToken: s.refreshToken, isLoggedIn: s.isLoggedIn }) }
  )
)

// 初始化时同步 accessToken 到 localStorage
const state = useAuthStore.getState()
if (state.accessToken) localStorage.setItem('access_token', state.accessToken)
