import React, { useState, useEffect, useMemo, useCallback } from 'react'
import ListingCard from '@/components/Cards/listingCard'
import ApplicationModal from '@/utils/applicationModal'
import '@/styles/Explore.css'
import Navbar from '@/components/Navbar/Navbar'
import Sidebar from '@/components/Sidebar/Sidebar'
import axios from 'axios'
import { Button, Select } from '@geist-ui/core'
import { Grid, List, Plus } from '@geist-ui/icons'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '@/components/Footer/Footer'
import ExploreForm from '@/components/Forms/ExploreForm'

const API_URL =
  'https://sponsorlink-backend.up.railway.app/api/bayes/getOrderedUsers/'

const formatListingsData = (data) => {
  return data.map((user) => ({
    image: `https://randomuser.me/api/portraits/${
      Math.random() > 0.5 ? 'women' : 'men'
    }/${Math.floor(Math.random() * 100)}.jpg`,
    name: user.name,
    user_type: user.user_type,
    opportunity_type: user.opportunity_type,
    industry: user.industry,
    labels: [...user.tags, ...user.specialized_tags],
    country: user.country,
    distance: user.distance,
    score: Math.floor(user.pHd * 100),
    description: `A ${user.user_type} specializing in ${user.industry}.`,
  }))
}

export default function Explore() {
  const navigate = useNavigate()
  const [state, setState] = useState({
    listings: [],
    isLoading: false,
    hasExplored: false,
    savedListings: [],
    viewMode: 'grid',
    itemsPerPage: '21',
    displayedItems: [],
    currentPage: 1,
    applications: [],
    showDetailsPage: false,
    selectedListing: null,
    showApplicationModal: false,
    applicationMessage: '',
    selectedFile: null,
    isSubmitting: false,
    isSubmitted: false,
  })

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      const storedApplications = JSON.parse(
        localStorage.getItem('applications') || '[]'
      )
      const cachedListings = JSON.parse(
        localStorage.getItem('exploreListings') || '[]'
      )
      const cachedHasExplored = JSON.parse(
        sessionStorage.getItem('hasExplored') || 'false'
      )
      const cachedSavedListings = JSON.parse(
        localStorage.getItem('savedListings') || '[]'
      )

      setState((prev) => ({
        ...prev,
        applications: storedApplications,
        listings: cachedListings,
        savedListings: Array.isArray(cachedSavedListings)
          ? cachedSavedListings
          : [],
        hasExplored: cachedHasExplored,
      }))
    }

    loadInitialData()
  }, [])

  // Update displayed items when dependencies change
  useEffect(() => {
    const endIndex = state.currentPage * parseInt(state.itemsPerPage)
    setState((prev) => ({
      ...prev,
      displayedItems: prev.listings.slice(0, endIndex),
    }))
  }, [state.listings, state.currentPage, state.itemsPerPage])

  const handleExplore = useCallback(async (formData) => {
    setState((prev) => ({ ...prev, isLoading: true }))

    const dataToSubmit = {
      ...formData,
      isApply: false,
      origin: 'search',
      description: 'This is a sample search query',
      tags: formData.tags.map((tag) => ({ name: tag, slider: 0.5 })),
      specializedTags: formData.specializedTags?.map?.((tag) => ({
        name: tag.trim(),
        slider: 0.5,
      })), // Example slider value
    }

    try {
      const response = await axios.post(API_URL, dataToSubmit)
      const formattedListings = formatListingsData(response.data)
      localStorage.setItem('exploreListings', JSON.stringify(formattedListings))
      sessionStorage.setItem('hasExplored', 'true')

      setState((prev) => ({
        ...prev,
        listings: formattedListings,
        hasExplored: true,
        isLoading: false,
      }))
    } catch (error) {
      console.error('Error fetching ordered users:', error)
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  const handleToggleSaveListing = useCallback((listing) => {
    setState((prev) => {
      const index = prev.savedListings.findIndex(
        (saved) => saved.name === listing.name
      )
      const updatedSavedListings =
        index === -1
          ? [...prev.savedListings, listing]
          : prev.savedListings.filter((_, i) => i !== index)

      localStorage.setItem(
        'savedListings',
        JSON.stringify(updatedSavedListings)
      )
      return { ...prev, savedListings: updatedSavedListings }
    })
  }, [])

  const handleShowDetails = useCallback(
    (listing) => {
      navigate('/explore/details', { state: { listing } })
    },
    [navigate]
  )

  const handleApplicationSubmit = () => {
    setState((prev) => ({
      ...prev,
      applications: [...prev.applications, application],
      isSubmitting: true,
    }))
    const seen = Math.random() < 0.5
    const application = {
      listing: state.selectedListing,
      message: state.applicationMessage,
      file: state.selectedFile ? state.selectedFile.name : null,
      timestamp: new Date().toISOString(),
      seen: seen,
      status: seen
        ? ['accepted', 'rejected'][Math.floor(Math.random() * 2)]
        : 'pending',
    }
    const existingApplications = JSON.parse(
      localStorage.getItem('applications') || '[]'
    )
    existingApplications.push(application)
    localStorage.setItem('applications', JSON.stringify(existingApplications))

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        isSubmitted: true,
      }))

      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          isSubmitted: false,
          showApplicationModal: false,
          applicationMessage: '',
          selectedFile: null,
        }))
        document.body.style.overflow = 'auto'
      }, 1000)
    }, 1200)
  }

  const renderedListings = useMemo(() => {
    return state.displayedItems.map((listing, index) => (
      <ListingCard
        key={`${listing.name}-${index}`}
        listing={listing}
        onToggleSave={handleToggleSaveListing}
        isSaved={state.savedListings.some(
          (saved) => saved.name === listing.name
        )}
        showApply={true}
        showRemove={false}
        applications={state.applications}
        showDetails={true}
        onShowDetails={handleShowDetails}
        onShowApplicationModal={() => {
          setState((prev) => ({
            ...prev,
            showApplicationModal: true,
            selectedListing: listing,
          }))
          document.body.style.overflow = 'hidden'
        }}
      />
    ))
  }, [
    state.displayedItems,
    state.savedListings,
    state.applications,
    handleToggleSaveListing,
  ])

  const handleNewSearch = useCallback(() => {
    setState((prev) => ({ ...prev, hasExplored: false }))
  }, [])

  return (
    <>
      <Navbar hasMenuButton={false} hasSearchbar={state.hasExplored} />
      <div className="main">
        <Sidebar hasSidebar={false} />
        <div className="Explore">
          {!state.showDetailsPage && (
            <>
              {!state.hasExplored ? (
                <div className="explore-container">
                  <ExploreForm
                    onSubmit={handleExplore}
                    loading={state.isLoading}
                  />
                </div>
              ) : (
                <>
                  <div className="explore-header">
                    <div className="explore-dash">
                      <div className="dash-left">
                        <Select initialValue="1">
                          <Select.Option value="1">
                            Sort by Relevance
                          </Select.Option>
                          <Select.Option value="2">
                            Sort by Distance
                          </Select.Option>
                        </Select>
                        <Button
                          onClick={handleNewSearch}
                          scale={0.8}
                          width="20%"
                        >
                          Filters
                        </Button>
                      </div>
                      <div className="dash-right">
                        <div className="view-toggle">
                          <Grid
                            size={16}
                            onClick={() =>
                              setState((prev) => ({
                                ...prev,
                                viewMode: 'grid',
                              }))
                            }
                            className={
                              state.viewMode === 'grid' ? 'active' : ''
                            }
                          />
                          <List
                            size={16}
                            onClick={() =>
                              setState((prev) => ({
                                ...prev,
                                viewMode: 'list',
                              }))
                            }
                            className={
                              state.viewMode === 'list' ? 'active' : ''
                            }
                          />
                        </div>
                        {/* <Button onClick={handleNewSearch} style={{fontWeight: '500'}} type="secondary-light" iconRight={<Plus />} auto>
                        New Search
                      </Button> */}
                      </div>
                    </div>
                    <div className="explore-title">
                      {state.listings.length} Results found
                    </div>
                  </div>
                  <div
                    className={
                      state.viewMode === 'grid' ? 'grid-auto' : 'list-auto'
                    }
                  >
                    {renderedListings}
                  </div>
                  {state.displayedItems.length < state.listings.length && (
                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                      <Button
                        onClick={() =>
                          setState((prev) => ({
                            ...prev,
                            currentPage: prev.currentPage + 1,
                          }))
                        }
                      >
                        Load More
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Add the ApplicationModal component */}
          {state.showApplicationModal && (
            <ApplicationModal
              setShowApplicationModal={(value) =>
                setState((prev) => ({ ...prev, showApplicationModal: value }))
              }
              listing={state.selectedListing}
              applicationMessage={state.applicationMessage}
              setApplicationMessage={(value) =>
                setState((prev) => ({ ...prev, applicationMessage: value }))
              }
              handleApplicationSubmit={handleApplicationSubmit}
              handleKeyPress={(e) => {
                if (
                  e.key === 'Enter' &&
                  state.applicationMessage.trim() !== ''
                ) {
                  e.preventDefault()
                  handleApplicationSubmit()
                }
              }}
              isSubmitting={state.isSubmitting}
              isSubmitted={state.isSubmitted}
              setSelectedFile={(file) =>
                setState((prev) => ({ ...prev, selectedFile: file }))
              }
              modalRef={React.createRef()}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
