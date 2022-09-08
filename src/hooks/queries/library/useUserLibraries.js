import { useAuth0 } from "@auth0/auth0-react"
import { useQuery } from "react-query"
import { fetchWithError } from "../../../utility/fns"

export const useUserLibraries = options => {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0()

  return useQuery(
    // ["users", user?.sub, "libraries"],
    ["libraries", { user: user?.sub }],
    () =>
      getAccessTokenSilently()
      .then(tkn =>
        fetchWithError(`/v2end/users/${user?.sub}/libraries`, {
          headers: { Authorization: `Bearer ${tkn}`}
        })),
    { enabled: isAuthenticated, ...options }
  )
}