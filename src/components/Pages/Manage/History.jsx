import React, { useState, useCallback, useEffect } from 'react';
import ListingCard from '@/components/Cards/listingCard';
import { Grid, List } from '@geist-ui/icons';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const [state, setState] = useState(() => ({
    viewHistory: [],
    viewMode: 'grid'
  }));

  const navigate = useNavigate();

  useEffect(() => {
    const viewHistory = JSON.parse(localStorage.getItem('viewHistory') || '[]');
    setState(prev => ({
      ...prev,
      viewHistory,
      viewMode: viewHistory.length >= 6 ? 'grid' : 'list'
    }));
  }, []);

  const handleShowDetails = useCallback((listing) => {
    navigate('/manage/history/details', { state: { listing } });
  }, [navigate]);

  return (
    <div className='saved-container'>
      <div className='flex'>
        <div className="saved-header">
          <div className='title'>Viewing History</div>
          <span>{state.viewHistory.length} {state.viewHistory.length === 1 ? 'Listing' : 'Listings'}</span>
        </div>
        {state.viewHistory.length >= 3 && (
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
          {state.viewHistory.length > 0 ? (
            state.viewHistory.map((listing, index) => (
              <ListingCard 
                key={index} 
                listing={listing} 
                showApply={false}
                showDetails={true}
                onShowDetails={handleShowDetails}
              />
            ))
          ) : (
            <p>No viewing history found.</p>
          )}
        </div>
      </div>
    </div>
  );
}