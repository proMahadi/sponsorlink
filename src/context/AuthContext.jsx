import clientAxios from '@/api/axios'
import { refreshToken as refetchToken } from '@/api/user'
import { createContext, useContext, useEffect, useState } from 'react'

export const AuthContext = createContext({
  user: {},
  accessToken: '',
  refreshToken: '',
  isAuthenticated: false,
  logout: () => {},
  setToken: (user, accessToken, refreshToken) => {},
})

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState({})
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem('refreshToken') ?? ''
  )

  useEffect(() => {
    if (refreshToken && !accessToken) {
      refetchToken(refreshToken).then(({ access, user_info, refresh }) => {
        setUser(user_info)
        setAccessToken(access)
        setRefreshToken(refresh)

        localStorage.setItem('refreshToken', refresh)

        clientAxios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${access}`
      })
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
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
