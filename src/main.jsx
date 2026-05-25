import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ServerProvider } from './store/ServerContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ServerProvider>
      <App />
    </ServerProvider>
  </StrictMode>,
)
