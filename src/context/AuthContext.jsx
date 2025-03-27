import { createContext, useContext, useState } from 'react'

export const AuthContext = createContext({
  user: {},
  setUser: (suer) => {},

  accessToken: '',
  setAccessToken: (token) => {},
})

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState({})
  const [accessToken, setAccessToken] = useState('')

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
