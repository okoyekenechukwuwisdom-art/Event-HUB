import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import EventHub from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './content/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <EventHub />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
