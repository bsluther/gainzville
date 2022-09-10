import { useAuth0 } from "@auth0/auth0-react"
import { useQuery } from "react-query"
import { fetchWithError } from "../../../../utility/fns"


export const useActivityInstances = (queryObj, options) => {
  const { getAccessTokenSilently } = useAuth0()

  const paramString = new URLSearchParams(queryObj).toString()

  return useQuery(
    ["activity", "instances", queryObj],
    () =>
      getAccessTokenSilently()
      .then(tkn =>
        fetchWithError(`/v2end/activity/instances?${paramString}`, {
          headers: { Authorization: `Bearer ${tkn}` }
        })),
    options
  )
}