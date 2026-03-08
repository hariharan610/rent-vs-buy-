import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import V1Brutalist from './versions/V1Brutalist.jsx'
import V2LuxuryEditorial from './versions/V2LuxuryEditorial.jsx'
import V3CRTTerminal from './versions/V3CRTTerminal.jsx'
import V4OrganicMinimal from './versions/V4OrganicMinimal.jsx'
import V5MemphisMaximalist from './versions/V5MemphisMaximalist.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/1" element={<V1Brutalist />} />
        <Route path="/2" element={<V2LuxuryEditorial />} />
        <Route path="/3" element={<V3CRTTerminal />} />
        <Route path="/4" element={<V4OrganicMinimal />} />
        <Route path="/5" element={<V5MemphisMaximalist />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
