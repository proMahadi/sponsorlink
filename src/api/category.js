import clientAxios from './axios'

export async function getCategory() {
  const { data } = await clientAxios.get('/account/categories/')

  return data
}

