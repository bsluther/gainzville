import { useAuth0 } from "@auth0/auth0-react"
import { useQuery, useQueryClient } from "react-query"
import { fetchWithError } from "../../../utility/fns"

export const useTypeTemplates = (paramsObj, options) => {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0()
  const queryClient = useQueryClient()

  const searchParams = new URLSearchParams({ user: user?.sub, ...paramsObj })

  return useQuery(
    ["type", "templates", { user: user?.sub, ...paramsObj }],
    ({ signal }) =>
      getAccessTokenSilently()
      .then(tkn => 
        fetchWithError(`/v2end/type/templates?${searchParams.toString()}`, {
          headers: { Authorization: `Bearer ${tkn}`},
          signal
        })),
    {
      ...options,
      enabled: isAuthenticated,
      onSuccess: templates => {
        templates.forEach(tmpl => {
          queryClient.setQueryData(
            ["type", "templates", tmpl.id],
            tmpl
          )
        })
      }
    }
  )
}