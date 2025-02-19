import React, { useEffect, useState, useCallback } from 'react';
import { Button, Card, Avatar, Textarea } from '@geist-ui/core';
import { ArrowLeft, MapPin, Briefcase, FileText, CheckCircle, Send } from '@geist-ui/icons';
import usePageName from '@/utils/usePageName';
import { useNavigate, useLocation } from 'react-router-dom';

const STORAGE_KEYS = {
  SAVED_LISTINGS: 'savedListings',
  APPLICATIONS: 'applications'
};

export default function ListingDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const pageName = usePageName();
  const selectedListing = location.state?.listing;

  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Memoized storage operations
  const getStorageItem = useCallback((key) => {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }, []);

  const setStorageItem = useCallback((key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const applications = getStorageItem(STORAGE_KEYS.APPLICATIONS);
    setIsApplied(applications?.some(app => app.listing.name === selectedListing.name));
    const savedListings = getStorageItem(STORAGE_KEYS.SAVED_LISTINGS);
    setIsSaved(savedListings.some(saved => saved.name === selectedListing.name));
  }, [selectedListing.name, getStorageItem]);

  useEffect(() => {
    const viewHistory = JSON.parse(localStorage.getItem('viewHistory') || '[]');
    const updatedHistory = [
      selectedListing,
      ...viewHistory.filter(item => item.name !== selectedListing.name)
    ];
    localStorage.setItem('viewHistory', JSON.stringify(updatedHistory));
  }, [selectedListing]);

  const handleToggleSaveListing = useCallback(() => {
    const savedListings = getStorageItem(STORAGE_KEYS.SAVED_LISTINGS);
    const isAlreadySaved = savedListings.some(saved => saved.name === selectedListing.name);
    
    const updatedListings = isAlreadySaved
      ? savedListings.filter(saved => saved.name !== selectedListing.name)
      : [...savedListings, selectedListing];
    
    setStorageItem(STORAGE_KEYS.SAVED_LISTINGS, updatedListings);
    setIsSaved(!isAlreadySaved); // Update the local state
  }, [selectedListing, getStorageItem, setStorageItem]);

  const handleApplicationSubmit = async () => {
    if (!applicationMessage.trim()) {
      alert('Please enter an application message');
      return;
    }

    setIsSubmitting(true);
    try {
      const seen = Math.random() < 0.5;
      const application = {
        listing: selectedListing,
        message: applicationMessage.trim(),
        file: selectedFile?.name || null,
        timestamp: new Date().toISOString(),
        seen: seen,
        status: seen ? ['accepted', 'rejected'][Math.floor(Math.random() * 2)] : 'pending'
      };

      const applications = getStorageItem(STORAGE_KEYS.APPLICATIONS);
      setStorageItem(STORAGE_KEYS.APPLICATIONS, [...applications, application]);

      // First delay to show "Sending..."
      await new Promise(resolve => setTimeout(resolve, 1200));
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Second delay to show "Sent!" with check mark
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsApplied(true);
      handleCancelApplicationForm();
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
      setIsSubmitting(false);
      setIsSubmitted(false);
    }
  };
  const handleCancelApplicationForm = useCallback(() => {
    if (isSubmitting) return;
    setShowApplicationForm(false);
    setApplicationMessage('');
    setSelectedFile(null);
    setIsSubmitted(false);
  }, [isSubmitting]);

  const renderDetailsInfo = () => (
    <div className="details-info">
      {[
        { Icon: MapPin, text: selectedListing.country },
        { Icon: Briefcase, text: selectedListing.opportunity_type },
        { Icon: FileText, text: selectedListing.industry }
      ].map(({ Icon, text }, index) => (
        <div key={index} className="info-item">
          <Icon size={20} />
          <span>{text}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className='Explore'>
      <div className="details-page">
        <Button 
          icon={<ArrowLeft />} 
          auto 
          scale={0.8} 
          onClick={() => navigate(-1)}
          style={{ marginBottom: '1.5rem' }}
        >
          Back to {pageName || "Page"}      
        </Button>
        
        <Card>
          <div className="listing-details">
            {/* Header Section */}
            <div className="details-header">
              <Avatar src={selectedListing.image} width="80px" height="80px" />
              <div className="details-title">
                <h2>{selectedListing.name}</h2>
                <div className="details-subtitle">
                  <span className="role">{selectedListing.opportunity_type}</span>
                  <span className="score">Match Score: {selectedListing.score}%</span>
                </div>
              </div>
            </div>

            {renderDetailsInfo()}

            {/* Description and Tags */}
            <div className="details-description">
              <h3>About</h3>
              <p>{selectedListing.description}</p>
            </div>

            <div className="details-tags">
              <h3>Skills & Interests</h3>
              <div className="labels">
                {selectedListing.labels.map((label, index) => (
                  <div key={index} className="label">{label}</div>
                ))}
              </div>
            </div>
              {/* Application Form */}
              {showApplicationForm && !isApplied && (
                <div className="application-form">
                  <h3>Apply to {selectedListing.name}</h3>
                  <Textarea 
                    placeholder="Enter your application message..." 
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                    width="100%"
                    rows={4}
                    disabled={isSubmitting || isSubmitted}
                    style={{background: '#fff'}}
                  />
                  <input 
                    type="file" 
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    disabled={isSubmitting || isSubmitted}
                    style={{width:"fit-content"}}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="listing-actions">

                {!showApplicationForm && (
                  <>
                  <button onClick={handleToggleSaveListing}>
                    {isSaved ? 'Unsave Listing' : 'Save Listing'}
                  </button>
                  <button 
                    onClick={() => isApplied ? window.location.href = '/manage/applications' : setShowApplicationForm(true)}
                  >
                    {isApplied ? 'Show Application' : 'Apply Now'}
                  </button>
                  </>
                )}
              
                {showApplicationForm && (
                  <>
                    <div className="form-buttons">
                      <button 
                        onClick={handleApplicationSubmit}
                        disabled={isSubmitting || isSubmitted || !applicationMessage.trim()}
                        title={!applicationMessage.trim() ? "Please Enter your Application message" : ""}
                        style={{ 
                          backgroundColor: isSubmitted ? '#4CAF50' : undefined,
                          cursor: isSubmitting || isSubmitted || !applicationMessage.trim() ? 'not-allowed' : 'pointer',
                          opacity: isSubmitting || isSubmitted || !applicationMessage.trim() ? 0.7 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          justifyContent: 'center'
                        }}
                      >
                        {isSubmitting ? 'Sending...' : 
                       isSubmitted ? (
                         <>
                           <CheckCircle size={18} />
                           Sent!
                         </>
                       ) : 'Send Application'}
                      </button>
                    </div>
                    <button
                      onClick={handleCancelApplicationForm}
                      disabled={isSubmitting}
                      style={{ 
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        backgroundColor: "#e9e9e9",
                        color: "#898989",
                        border: "solid 1px",
                      }}
                    >
                      Cancel
                    </button>
                  </>
                )}              
              </div>
            </div>
        </Card>
      </div>
    </div>
  );
}


