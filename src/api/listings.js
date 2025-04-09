import clientAxios from './axios'

export async function getListings() {
  const { data } = await clientAxios.get('/account/listings/')
  return data
}


export async function getSavedListing() {
  const{data}= await clientAxios.get("account/saved-listing/")
  return data
}
export async function saveListing(id) {
  const{data}= await clientAxios.post("account/saved-listing/",{
    listing_id:id
  })
  return data
}
export async function deleteListing(id) {
  const{data}= await clientAxios.delete("account/delete-saved-listing/",{
    listing_id:id
  })
  return data
}
