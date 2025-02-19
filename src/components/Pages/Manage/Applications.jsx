import React, { useState, useEffect } from "react"
import ListingCard from "@/components/Cards/listingCard"
import Sidebar from "@/components/Sidebar/Sidebar"
import { Clock, File, Eye, EyeOff, CheckCircle, XCircle, Clock as ClockCircle } from "@geist-ui/icons"

import '@/styles/Applications.css'

export default function Applications() {
  const [applications, setApplications] = useState([])

  useEffect(() => {
    const storedApplications = JSON.parse(localStorage.getItem('applications') || '[]')
    setApplications(storedApplications.reverse())
  }, [])

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const then = new Date(timestamp)
    const diffInMinutes = Math.floor((now - then) / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    if (diffInHours < 24) return `${diffInHours} hours ago`
    return `${diffInDays} days ago`
  }

  const handleRemoveApplication = (index) => {
    const updatedApplications = applications.filter((_, i) => i !== index)
    setApplications(updatedApplications)
    localStorage.setItem('applications', JSON.stringify(updatedApplications))
  }

  return (
    <>
        <Sidebar hasSidebar={false} />
        <div className="applications-container">
          <div className="applications-header">
            <div className="title">My Applications</div>
            <span>{applications.length} {applications.length === 1 ? 'Application' : 'Applications'}</span>
          </div>
          <div className="applications-grid">
            {applications.map((application, index) => (
              <div key={index} className="application-item">
                <ListingCard
                  listing={application.listing}
                  showSave={false}
                  showApply={false}
                  showRemove={true}
                  maxLabels={4}
                  onRemove={() => handleRemoveApplication(index)}
                />
                <div className="application-details">
                  <div className="application-status">
                    <div>Application Details</div>
                    <div className="status-indicators">
                      <div className="time-submitted">
                        <Clock size={14} />
                        <span>{getTimeAgo(application.timestamp)}</span>
                      </div>
                      <div className="seen-status">
                        {application.seen ? (
                          <>
                            <Eye size={14} />
                            <span>Seen</span>
                          </>
                        ) : (
                          <>
                            <EyeOff size={14} />
                            <span>Not seen yet</span>
                          </>
                        )}
                      </div>
                      <div className="acceptance-status" style={{
                        color: application.status === 'accepted' ? '#4CAF50' : 
                               application.status === 'rejected' ? '#e90000' : 'inherit'
                      }}>
                        {application.status === 'accepted' ? <CheckCircle size={14} /> :
                         application.status === 'rejected' ? <XCircle size={14} /> :
                         <ClockCircle size={14} />}
                        <span>{(application.status || 'Pending').charAt(0).toUpperCase() + (application.status || 'Pending').slice(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="message-section">
                    <div>Your Message</div>
                    <p>{application.message}</p>
                  </div>
                  {application.file && (
                    <div className="file-section">
                      <File size={15} />
                      <span>{application.file}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
    </>
  )
}