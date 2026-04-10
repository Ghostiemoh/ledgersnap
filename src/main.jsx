import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { LedgerProvider } from './context/LedgerContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <LedgerProvider>
        <App />
      </LedgerProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
