// import "dotenv/config"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Auth0ProviderWithHistory } from './auth/Auth0ProviderWithHistory'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithHistory>
        <QueryClientProvider client={queryClient}>
          <App /> 
          {/* <ReactQueryDevtools /> */}
        </QueryClientProvider>
      </Auth0ProviderWithHistory>
    </BrowserRouter>
  </React.StrictMode>
)
