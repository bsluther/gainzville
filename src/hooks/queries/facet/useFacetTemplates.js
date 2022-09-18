import { useAuth0 } from "@auth0/auth0-react"
import { map } from "ramda"
import { useQueries, useQuery, useQueryClient } from "react-query"
import { fetchWithError } from "../../../utility/fns"

export const useFacetTemplates = (queryObj, options) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  const queryClient = useQueryClient()

  const params = new URLSearchParams(queryObj)

  return useQuery(
    ["facet", "templates", queryObj],
    () =>
      getAccessTokenSilently()
      .then(tkn =>
        fetchWithError(`/v2end/facet/templates?${params.toString()}`, {
          headers: { Authorization: `Bearer ${tkn}`}
        })
        .then(templates => {
          templates.forEach(tmpl => {
            queryClient.setQueryData(
              ["facet", "templates", tmpl.id],
              tmpl
            )
          })
          return templates
        })),
    {
      enabled: isAuthenticated,
      ...options
    }
  )
}

export const useFacetTemplatesById = (ids, options) => {
  const { getAccessTokenSilently } = useAuth0()

  return useQueries(
    map(id => ({
      queryKey: ["facet", "templates", id],
      queryFn: () =>
        getAccessTokenSilently()
        .then(tkn =>
          fetchWithError(`/v2end/facet/templates/${id}`, {
            headers: { Authorization: `Bearer ${tkn}` }
          })),
      ...options
    }))(ids)
  )
}