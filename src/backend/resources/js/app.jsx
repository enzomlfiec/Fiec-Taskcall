import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './frontend/App.jsx'
import './frontend/assets/scripts/userInfo.jsx'
import '../css/taskcall.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
