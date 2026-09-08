import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/mobile.css'
import { MobileApp } from './mobile/MobileApp'

createRoot(document.getElementById('mobile-root')!).render(
  <React.StrictMode>
    <MobileApp />
  </React.StrictMode>,
)
