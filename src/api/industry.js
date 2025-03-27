import clientAxios from './axios'

export async function getIndustry() {
  const { data } = await clientAxios.get('/account/industrys/')

  return data
}