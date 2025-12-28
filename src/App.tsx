import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <AppRoutes />
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  )
}

export default App
