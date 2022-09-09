import React, { useLayoutEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import DesktopApp from './DesktopApp'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Auth0ProviderWithHistory } from './components/auth/Auth0ProviderWithHistory'
import { MobileApp } from './MobileApp'

const queryClient = new QueryClient();

const AppBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState()

  useLayoutEffect(() => {
    if (window.innerWidth < 640) {
      setBreakpoint('mobile')
    } else {
      setBreakpoint('desktop')
    }
  }, [window.innerWidth])

  if (breakpoint === "desktop") {
    return (
      <DesktopApp />
    )
  }

  return (
    <MobileApp />
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithHistory>
        <QueryClientProvider client={queryClient}>
          <AppBreakpoint /> 
          <ReactQueryDevtools />
        </QueryClientProvider>
      </Auth0ProviderWithHistory>
    </BrowserRouter>
  </React.StrictMode>
)
