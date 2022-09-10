import { useAuth0 } from "@auth0/auth0-react"
import { useQuery } from "react-query"
import { fetchWithError } from "../../../utility/fns"

export const useFacetTemplate = (facetId, options) => {
  const { getAccessTokenSilently } = useAuth0()

  return useQuery(
    ["facet", "templates", facetId],
    () =>
      getAccessTokenSilently()
      .then(tkn => 
        fetchWithError(`/v2end/facet/templates/${facetId}`, {
          headers: { Authorization: `Bearer ${tkn}` }
        })
      )
  )
}