import clientAxios from './axios'

export async function getUser() {
  const { data } = await clientAxios.get('/account/current-user/')

  return data
}

export async function login(username, password) {
  const { data } = await clientAxios.post('/token/', {
    username,
    password,
  })

  return data
}

export async function signup(username, password) {
  await clientAxios.post('/account/sign-up/', {
    username,
    password,
  })

  return login(username, password)
}

export async function refreshToken(token) {
  const { data } = await clientAxios.post('/token/refresh/', {
    refresh: token,
  })

  return data
}
