import React from 'react';

const OptionsIcon = () => (
  <svg 
    className="options-icon" 
    data-testid="geist-icon" 
    fill="none" 
    height="24" 
    shapeRendering="geometricPrecision" 
    stroke="currentColor" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    strokeWidth="1.5" 
    viewBox="0 0 24 24" 
    width="24" 
    style={{ 
      color: '#898989', 
      width: '22px', 
      height: '22px', 
      cursor: 'pointer', 
      padding: '2px', 
      borderRadius: '6px', 
      transition: 'all 0.15s ease-in' 
    }}
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

export default OptionsIcon;