import { useAuth0 } from "@auth0/auth0-react"
import { useQuery } from "react-query"
import { fetchWithError } from "../../../utility/fns"

export const useUser = () => {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0()
  
  return useQuery(
    ["currentUser"],
    () => {
      return getAccessTokenSilently()
      .then(tkn =>
        fetchWithError(`/v2end/users/${user.sub}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tkn}`
          }
        }))
    },
    {
      enabled: isAuthenticated
    }
  )
}