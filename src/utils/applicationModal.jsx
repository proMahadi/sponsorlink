import React from 'react';
import { Textarea } from '@geist-ui/core';
import { CheckCircle } from "@geist-ui/icons";

export default function ApplicationModal({
  setShowApplicationModal,
  listing,
  applicationMessage,
  setApplicationMessage,
  handleApplicationSubmit,
  handleKeyPress,
  isSubmitting,
  isSubmitted,
  setSelectedFile,
  modalRef
}) {
  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target.className === 'modal-overlay') {
        setShowApplicationModal(false);
        document.body.style.overflow = 'auto';
      }
    }}>
      <div className="application-modal" ref={modalRef}>
        <h3>Apply to {listing.name}</h3>
        <Textarea 
          placeholder="Enter your application message..." 
          value={applicationMessage}
          onChange={(e) => setApplicationMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          width="100%"
          rows={4}
          disabled={isSubmitting || isSubmitted}
        />
        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
        <div className="modal-buttons">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleApplicationSubmit();
            }}
            disabled={isSubmitting || isSubmitted}
            style={{ backgroundColor: isSubmitted ? '#7fafcf' : undefined }}
          >
            {isSubmitting ? 'Loading...' : isSubmitted ? <CheckCircle size={18} /> : 'Submit Application'}
          </button>
          <button onClick={(e) => {
            e.stopPropagation();
            setShowApplicationModal(false);
            document.body.style.overflow = 'auto';
          }}>Close</button>
        </div>
      </div>
    </div>
  );
}
