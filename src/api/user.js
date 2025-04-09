import clientAxios from './axios'

export async function getUser() {
  const { data } = await clientAxios.get('/account/current-user/')

  return data
}

export async function login(email, password) {
  const { data } = await clientAxios.post('/token/', {
    email,
    password,
  })

  return data
}

export async function signup(email, password) {
  await clientAxios.post('/account/sign-up/', {
    email,
    password,
  })

  return login(email, password)
}

export async function refreshToken(token) {
  const { data } = await clientAxios.post('/token/refresh/', {
    refresh: token,
  })

  return data
}

export async function updateProfile(user, profile) {
  await clientAxios.patch('/account/update-profile/', {
    user,
    profile,
  })
}

export async function updateProfileImage(file) {
  const formData = new FormData()
  formData.append('image', file)

  await clientAxios.patch('/account/profile/image/', formData)
}

export async function getCurrentUser() {
  const { data } = await clientAxios.get('/account/current-user/')
  return data
}
