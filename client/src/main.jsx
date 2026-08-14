import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.jsx'
import './index.css'

import { ThemeModeProvider } from './context/ThemeModeContext.jsx'
import AppTheme from './components/common/AppTheme.jsx'

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeModeProvider>
        <AppTheme>
          <App />
        </AppTheme>
      </ThemeModeProvider>
    </BrowserRouter>
  </React.StrictMode>
)