import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
const temaSalvo = localStorage.getItem('questio-tema') || 'claro'

document.documentElement.setAttribute('data-theme', temaSalvo)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
