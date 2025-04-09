import clientAxios from '@/api/axios'
import { refreshToken as refetchToken } from '@/api/user'
import { createContext, useContext, useEffect, useState } from 'react'

export const AuthContext = createContext({
  user: {},
  profile: {},
  accessToken: '',
  refreshToken: '',
  isAuthenticated: false,
  logout: () => {},
  refresh: () => {},
  setUser: (user) => {},
  setProfile: (profile) => {},
  setToken: (accessToken, refreshToken) => {},
  setAuth: (user, profile, accessToken, refreshToken) => {},
})

export function AuthContextProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false)

  const [user, setUser] = useState({})
  const [profile, setProfile] = useState({})

  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem('refreshToken') ?? ''
  )

  function setAuth(user, profile, accessToken, refreshToken) {
    setUser(user)
    setProfile(profile)
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)

    localStorage.setItem('refreshToken', refreshToken)

    clientAxios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${accessToken}`
  }

  async function refreshAuth() {
    const { access, user_info, profile, refresh } = await refetchToken(
      refreshToken
    )

    setAuth(user_info, profile, access, refresh)
  }

  useEffect(() => {
    if (refreshToken && !accessToken) {
      setIsLoading(true)
      refreshAuth()
        .catch(() => {})
        .finally(() => setIsLoading(false))
    }
  }, [accessToken, refreshToken])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        accessToken,
        refreshToken,
        isAuthenticated: !!(accessToken && refreshToken),
        logout() {
          setUser({})
          setAccessToken('')
          setRefreshToken('')

          localStorage.removeItem('refreshToken')

          clientAxios.defaults.headers.common['Authorization'] = ''
        },
        setUser,
        setProfile,
        setAuth,
        refresh: refreshAuth,
      }}
    >
      {isLoading ? (
        <div
          style={{
            inset: 0,
            position: 'fixed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h1>Loading...</h1>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
