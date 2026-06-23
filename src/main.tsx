import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import QueryProvider from './providers/QueryProvider'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryProvider>
      <App />
      <ToastContainer position="top-right" autoClose={5000} />
    </QueryProvider>
  </React.StrictMode>,
)
