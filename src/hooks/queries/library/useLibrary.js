import { useQuery } from "react-query"
import { fetchWithError } from "../../../utility/fns"
import { useAuth0 } from "@auth0/auth0-react"

export const useLibrary = (id, options) => {
  const { getAccessTokenSilently } = useAuth0()
  return useQuery(
    ["libraries", id],
    () =>
      getAccessTokenSilently()
      .then(
        tkn =>
          fetchWithError(
            `/v2end/libraries/${id}`,
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tkn}`
              }
            }
          ),
        () =>
          fetchWithError(
            `/v2end/libraries/${id}`,
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
          )
      ),
    options
  )
}