import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import { getSavedListing } from "@/api/listings";

export const SavedListingContext = createContext({
    savedListing:[],
    setSavedListing:()=>{}
});

export function SavedListingContextProvider({ children }) {
  const [savedListing, setSavedListing] = useState([]);
  const { isAuthenticated } = useAuthContext();
  useEffect(() => {
    if (isAuthenticated) {
      getSavedListing().then((data) => setSavedListing(data)).catch(()=>{});
    }
  }, [isAuthenticated]);
  return (
    <SavedListingContext.Provider value={
        {
            savedListing,
            setSavedListing,
        }
    }>{children}</SavedListingContext.Provider>
  );
}

export function useSavedListingContext() {
  return useContext(SavedListingContext);
}
