import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'

import { GeistProvider } from '@geist-ui/core';

window.stickySidebar = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GeistProvider>
    <App />
    </GeistProvider>
  </React.StrictMode>,
)
