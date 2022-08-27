import { useAuth0 } from "@auth0/auth0-react"
import { useMutation } from "react-query"
import { fetchWithError } from "../../../utility/fns"

export const useUpdateUser = options => {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0()

  return useMutation(
    entries =>
      getAccessTokenSilently()
      .then(tkn =>
        fetchWithError(`/v2end/users/${user?.sub}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tkn}`
          },
          body: JSON.stringify(entries)
        })),
    {
      ...options,
      enabled: isAuthenticated
    }
  )
}