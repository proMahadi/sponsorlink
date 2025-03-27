import clientAxios from './axios'

export async function getListings() {
  const { data } = await clientAxios.get('/account/listings/')
  return data
}
