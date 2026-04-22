export interface TokenResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
}

export const authApi = {
  login: async (email: string, password: string): Promise<TokenResponse> => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json?.error?.message || '登录失败')
    const d = json.data
    return {
      accessToken: d.access_token,
      refreshToken: d.refresh_token,
      tokenType: d.token_type,
    }
  },

  logout: async (refreshToken: string): Promise<void> => {
    await fetch(`/api/auth/logout?refresh_token=${encodeURIComponent(refreshToken)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token') || ''}` },
    })
  },
}
