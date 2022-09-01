import { useNavigate } from "react-router-dom"
import { Auth0Provider } from "@auth0/auth0-react"

export const Auth0ProviderWithHistory = ({ children }) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN
  console.log(domain, 'domain')
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
  console.log(clientId, 'clientId')
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE
  console.log(audience, 'audience')

  const navigate = useNavigate()

  // This may need to be changed if the purpose is to replace the current location instead of pushing a new one onto the history stack
  const onRedirectCallback = appState => {
    navigate(appState?.returnTo || window.location.pathname)
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
      audience={audience}
    >
      {children}
    </Auth0Provider>
  )
}