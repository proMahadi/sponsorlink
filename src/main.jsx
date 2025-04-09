import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.jsx";

import { GeistProvider } from "@geist-ui/core";
import { AuthContextProvider } from "./context/AuthContext";
import { SavedListingContextProvider } from "./context/SavedListingContext";

window.stickySidebar = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GeistProvider>
      <AuthContextProvider>
        <SavedListingContextProvider>
          <App />
        </SavedListingContextProvider>
      </AuthContextProvider>
    </GeistProvider>
  </React.StrictMode>
);
