import { useAuth0 } from "@auth0/auth0-react"
import { useQuery } from "react-query"
import { fetchWithError } from "../../../../utility/fns"

export const useActivityInstance = id => {
  const { getAccessTokenSilently } = useAuth0()
  return useQuery(
    ["activity", "instances", id],
    () => 
      getAccessTokenSilently()
      .then(tkn => 
        fetchWithError(`/v2end/activity/instances/${id}`, {
          headers: { Authorization: `Bearer ${tkn}`}
        })
      ),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000
    }
  )
}