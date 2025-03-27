import React, { useState, useEffect, useRef } from 'react'
import OptionsIcon from '@/utils/optionsIcon'
import '@/styles/listingCard.css'
import { Bookmark, MapPin, MessageCircle } from '@geist-ui/icons'

export default function ListingCard({
  listing,
  onToggleSave,
  isSaved,
  maxLabels = 5,
  showRemove = false,
  showApply = false,
  showSave = true,
  showDetails = true,
  onShowDetails = () => {},
  applications = [],
  onRemove = () => {},
  onShowApplicationModal = () => {},
}) {
  console.log(listing)

  const [isOptionsVisible, setIsOptionsVisible] = useState(false)
  const optionsRef = useRef(null)

  const isAlreadyApplied = () => {
    return applications.some((app) => app.listing.name === listing.name)
  }

  const toggleOptions = () => {
    setIsOptionsVisible((prevState) => !prevState)
  }

  const handleClickOutside = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setIsOptionsVisible(false)
    }
  }

  useEffect(() => {
    if (isOptionsVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOptionsVisible])

  const getColor = (score) => {
    if (score >= 60) return '#75e775'
    if (score >= 50) return '#f1c40f'
    return '#e74c3c'
  }

  const handleSaveToggle = () => {
    onToggleSave(listing, toggleOptions)
  }

  const handleClick = () => {
    if (showDetails) {
      onShowDetails(listing)
    }
  }

  return (
    <div className="listing-card" onClick={() => showDetails && handleClick()}>
      <div className="listing-header">
        <div className="listing-strap">
          <div
            onClick={(e) => {
              e.stopPropagation()
            }}
            className="listing-profile"
          >
            <div className="listing-img">
              <img
                alt={`${listing.user.name}'s profile`}
                src={`https://randomuser.me/api/portraits/men/${listing.id}.jpg`}
              />
            </div>
            <div className="listing-name">
              {listing.user.first_name} {listing.user.last_name}
            </div>
          </div>
          <div className="listing-info">
            <div className="listing-role">{listing.opportunity_type}</div>
            <div className="listing-employment">{listing.industry}</div>
            <div className="listing-location">
              <MapPin size={14} />
              <div className="listing-address">{listing.country}</div>
            </div>
          </div>
        </div>
        <div className="listing-options" ref={optionsRef}>
          <div
            className="listing-score"
            style={{ color: getColor(listing.score) }}
          >
            {listing.score}
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation()
              toggleOptions()
            }}
            style={{ cursor: 'pointer' }}
          >
            <OptionsIcon />
          </div>
          {isOptionsVisible && (
            <div className="options-popup">
              {showApply && (
                <div
                  className={`option ${isAlreadyApplied() ? 'inactive' : ''}`}
                  onClick={(e) => {
                    if (!isAlreadyApplied()) {
                      e.stopPropagation()
                      onShowApplicationModal()
                      toggleOptions()
                    } else {
                      e.stopPropagation()
                    }
                  }}
                  style={{
                    opacity: isAlreadyApplied() ? 0.5 : 1,
                    cursor: isAlreadyApplied() ? 'default' : 'pointer',
                  }}
                >
                  {isAlreadyApplied() ? 'Applied' : 'Apply'}
                  <MessageCircle
                    size={17}
                    fill={isAlreadyApplied() ? 'black' : 'none'}
                  />
                </div>
              )}
              {showSave && (
                <div
                  className="option"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSaveToggle()
                  }}
                >
                  {isSaved ? 'Unsave' : 'Save'}
                  <Bookmark size={17} fill={isSaved ? 'black' : 'none'} />
                </div>
              )}
              <div className="option" onClick={(e) => e.stopPropagation()}>
                Report
              </div>
              {showRemove && (
                <div
                  id="removeCard"
                  className="option"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsOptionsVisible(false)
                    setTimeout(() => {
                      onRemove()
                    }, 200)
                  }}
                >
                  Remove
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="listing-description">{listing.description}</div>
      <div className="listing-footer">
        <div className="labels">
          {listing.labels?.slice(0, maxLabels).map((label, index) => (
            <div key={index} className="label">
              <span>#</span> {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
