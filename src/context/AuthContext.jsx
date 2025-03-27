import clientAxios from '@/api/axios'
import { refreshToken as refetchToken } from '@/api/user'
import { createContext, useContext, useEffect, useState } from 'react'

export const AuthContext = createContext({
  user: {},
  accessToken: '',
  refreshToken: '',
  isAuthenticated: false,
  logout: () => {},
  setAuth: (user, accessToken, refreshToken) => {},
})

export function AuthContextProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false)

  const [user, setUser] = useState({})
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem('refreshToken') ?? ''
  )

  useEffect(() => {
    if (refreshToken && !accessToken) {
      setIsLoading(true)
      refetchToken(refreshToken)
        .then(({ access, user_info, refresh }) => {
          setUser(user_info)
          setAccessToken(access)
          setRefreshToken(refresh)

          localStorage.setItem('refreshToken', refresh)

          clientAxios.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${access}`
        })
        .catch(() => {})
        .finally(() => setIsLoading(false))
    }
  }, [accessToken, refreshToken])

  return (
    <AuthContext.Provider
      value={{
        user,
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
        setAuth(user, accessToken, refreshToken) {
          setUser(user)
          setAccessToken(accessToken)
          setRefreshToken(refreshToken)

          localStorage.setItem('refreshToken', refreshToken)

          clientAxios.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${accessToken}`
        },
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
