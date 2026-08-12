import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { blockVendorWidgets } from './lib/blockVendorWidgets'

// Runs before render so the host-injected badge is suppressed as early as possible.
blockVendorWidgets();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
