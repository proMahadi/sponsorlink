import { createContext, useContext, useEffect, useState } from 'react'
import { useAuthContext } from './AuthContext'
import { deleteListing, getSavedListing, saveListing } from '@/api/listings'

export const SavedListingContext = createContext({
  savedListing: [],
  setSavedListing: () => {},

  addSavedListing: () => {},
  removeSavedListing: () => { },
  toggleSavedListing: () => { },
})

export function SavedListingContextProvider({ children }) {
  const { isAuthenticated } = useAuthContext()
  const [savedListing, setSavedListing] = useState([])

  useEffect(() => {
    if (isAuthenticated) {
      getSavedListing()
        .then((data) => setSavedListing(data))
        .catch(() => {})
    }
  }, [isAuthenticated])

  function addSavedListing(listing) {
    saveListing(listing.id)
    setSavedListing((prev) => [...prev, listing])
  }

  function removeSavedListing(listingId) {
    deleteListing(listingId)
    setSavedListing((prev) => {
      return prev.filter((listing) => listing.id !== listingId)
    })
  }

  function toggleSavedListing(listing) {
    if (savedListing.some((item) => item.id === listing.id)) {
      removeSavedListing(listing.id)
    } else {
      addSavedListing(listing)
    }
  }

  return (
    <SavedListingContext.Provider
      value={{
        savedListing,
        setSavedListing,
        addSavedListing,
        removeSavedListing,
        toggleSavedListing,
      }}
    >
      {children}
    </SavedListingContext.Provider>
  )
}

export function useSavedListingContext() {
  return useContext(SavedListingContext)
}
