import { useAuth0 } from "@auth0/auth0-react"
import { useQuery, useQueryClient } from "react-query"
import { fetchWithError } from "../../../utility/fns"

export const useFacetTemplates = options => {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0()
  const queryClient = useQueryClient()

  return useQuery(
    ["facet", "templates", { user: user?.sub }],
    () =>
      getAccessTokenSilently()
      .then(tkn =>
        fetchWithError(`/v2end/facet/templates?user=${user?.sub}`, {
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