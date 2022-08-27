import { useAuth0 } from "@auth0/auth0-react"
import { useQuery, useQueryClient } from "react-query"
import { primitives } from "../../../data/typeTemplate/TypeTemplate"
import { fetchWithError } from "../../../utility/fns"

export const useTypeTemplates = options => {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0()
  const queryClient = useQueryClient()

  return useQuery(
    ["type", "templates", { user: user?.sub }],
    () =>
      getAccessTokenSilently()
      .then(tkn => 
        fetchWithError(`/v2end/type/templates?user=${user?.sub}`, {
          headers: { Authorization: `Bearer ${tkn}`}
        }))
      .then(data => primitives.concat(data)),
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