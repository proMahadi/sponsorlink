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
