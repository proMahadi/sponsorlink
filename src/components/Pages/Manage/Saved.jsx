import React, { useState, useCallback, useEffect } from 'react';
import ListingCard from '@/components/Cards/listingCard';
import ListingDetails from '@/components/Cards/listingDetails';  
import { Grid, List } from '@geist-ui/icons';
import ApplicationModal from '@/utils/applicationModal';
import { useNavigate } from 'react-router-dom';

export default function Saved() {
    const savedListings = JSON.parse(localStorage.getItem('savedListings')) || [];
    const [state, setState] = useState(() => ({
      savedListings: savedListings,
      showDetailsPage: false,
      selectedListing: null,
      viewMode: savedListings.length >= 6 ? 'grid' : 'list',
      showApplicationModal: false,
      applications: [],
      applicationMessage: "",
    }));

    const navigate = useNavigate();

    useEffect(() => {
      const loadInitialData = async () => {
        const storedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
        const cachedListings = JSON.parse(localStorage.getItem('exploreListings') || '[]');
        const cachedHasExplored = JSON.parse(sessionStorage.getItem('hasExplored') || 'false');
        const cachedSavedListings = JSON.parse(localStorage.getItem('savedListings') || '[]');
  
        if (cachedListings.length === 0) {
          try {
            const response = await axios.post(API_URL, DUMMY_DATA);
            const formattedListings = formatListingsData(response.data);
            localStorage.setItem('exploreListings', JSON.stringify(formattedListings));
            
            setState(prev => ({
              ...prev,
              applications: storedApplications,
              listings: formattedListings,
              savedListings: Array.isArray(cachedSavedListings) ? cachedSavedListings : [],
              hasExplored: cachedHasExplored,
            }));
          } catch (error) {
            console.error('Error fetching ordered users:', error);
          }
        } else {
          setState(prev => ({
            ...prev,
            applications: storedApplications,
            listings: cachedListings,
            savedListings: Array.isArray(cachedSavedListings) ? cachedSavedListings : [],
            hasExplored: cachedHasExplored,
          }));
        }
      };
  
      loadInitialData();
    }, []);
  
    const handleRemoveListing = (listing, toggleOptions) => {
      setState(prevState => {
        const updatedSavedListings = prevState.savedListings.filter(savedListing => savedListing.name !== listing.name);
        localStorage.setItem('savedListings', JSON.stringify(updatedSavedListings));
        return {
          ...prevState,
          savedListings: updatedSavedListings,
          viewMode: updatedSavedListings.length >= 6 ? 'grid' : 'list'
        };
      });
      toggleOptions();
    };

    const handleShowDetails = useCallback((listing) => {
      navigate('/manage/saved/details', { state: { listing } });
    }, [navigate]);

    const handleToggleSaveListing = useCallback((listing) => {
      setState(prev => {
        const index = prev.savedListings.findIndex(saved => saved.name === listing.name);
        const updatedSavedListings = index === -1 
          ? [...prev.savedListings, listing]
          : prev.savedListings.filter((_, i) => i !== index);
        
        localStorage.setItem('savedListings', JSON.stringify(updatedSavedListings));
        return { 
          ...prev, 
          savedListings: updatedSavedListings,
          viewMode: updatedSavedListings.length >= 6 ? 'grid' : 'list'
        };
      });
    }, []);

    const handleBackToEvent = useCallback(() => {
      setState(prev => ({
        ...prev,
        showDetailsPage: false,
        selectedListing: null
      }));
    }, []);

    const handleApplicationSubmit = () => {
      setState(prev => ({ 
        ...prev, 
        applications: [...prev.applications, application], 
        isSubmitting: true,
      }));
      const seen = Math.random() < 0.5;
      const application = {
        listing: state.selectedListing,
        message: state.applicationMessage,
        file: state.selectedFile ? state.selectedFile.name : null,
        timestamp: new Date().toISOString(),
        seen: seen,
        status: seen ? ['accepted', 'rejected'][Math.floor(Math.random() * 2)] : 'pending',
      };
      const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      existingApplications.push(application);
      localStorage.setItem('applications', JSON.stringify(existingApplications));
  
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          isSubmitting: false,
          isSubmitted: true,
        }));
  
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            isSubmitting: false,
            isSubmitted: false,
            showApplicationModal: false,
            applicationMessage: "",
            selectedFile: null
          }));
          document.body.style.overflow = 'auto';
        }, 1000);
      }, 1200);
    };
  
    return (
      <div className='saved-container'>
        {!state.showDetailsPage && ( 
        <>

        <div className='flex'>
          <div className="saved-header">
            <div className='title'>Saved Listings</div>
            <span>{state.savedListings.length} {state.savedListings.length === 1 ? 'Listing' : 'Listings'}</span>
          </div>
          {state.savedListings.length >= 3 && (
            <div className="view-toggle">
              <Grid 
                size={16}
                onClick={() => setState(prev => ({ ...prev, viewMode: 'grid' }))} 
                className={state.viewMode === 'grid' ? 'active' : ''}
              />
              <List 
                size={16}
                onClick={() => setState(prev => ({ ...prev, viewMode: 'list' }))} 
                className={state.viewMode === 'list' ? 'active' : ''}
              />
            </div>
          )}
        </div>

        <div className="saved-listings">
          <div className={state.viewMode === 'list' ? 'list-auto' : 'grid-auto'}>
            {state.savedListings.length > 0 ? (
              state.savedListings.map((listing, index) => (
                <ListingCard 
                key={index} 
                listing={listing} 
                isSaved={true} 
                showApply={false}
                showDetails={true}
                onToggleSave={handleRemoveListing}
                onShowDetails={handleShowDetails}
                />
              ))
            ) : (
              <p>No saved listings found.</p>
            )}
          </div>
        </div>

        </>
        )}

      </div>
    );
  }