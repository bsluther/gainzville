import { useAuth0 } from "@auth0/auth0-react"
import { useQuery } from "react-query"
import { fetchWithError } from "../../../../utility/fns"

export const useActivityTemplate = (id, options) => {
  const { getAccessTokenSilently } = useAuth0()

  return useQuery(
    ["activity", "templates", id],
    () =>
      getAccessTokenSilently()
      .then(tkn =>
        fetchWithError(`/v2end/activity/templates/${id}`, {
          headers: { Authorization: `Bearer ${tkn}` }
        })
      ),
    { enabled: !!id, ...options }
  )
}