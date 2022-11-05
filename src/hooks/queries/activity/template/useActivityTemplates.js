import { useAuth0 } from "@auth0/auth0-react"
import { useQuery } from "react-query"
import { fetchWithError } from "../../../../utility/fns"


export const useActivityTemplates = (queryObj, options) => {
  const { getAccessTokenSilently } = useAuth0()
  const searchParams = new URLSearchParams(queryObj)

  return useQuery(
    ["activity", "templates", queryObj],
    () =>
      getAccessTokenSilently()
      .then(tkn => 
        fetchWithError(`/v2end/activity/templates?${searchParams.toString() ?? ""}`, {
          headers: { Authorization: `Bearer ${tkn}` }
        })),
    options
  )
}