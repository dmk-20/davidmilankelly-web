import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const runAnalytics = () => import('@vercel/analytics').then(({ inject }) => inject())
if ('requestIdleCallback' in window) {
  requestIdleCallback(runAnalytics, { timeout: 2500 })
} else {
  setTimeout(runAnalytics, 1200)
}
