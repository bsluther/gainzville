import { useAuth0 } from "@auth0/auth0-react"
import { useQuery } from "react-query"
import { fetchWithError } from "../../../utility/fns"


export const useTypeTemplate = (id, options) => {
  const { getAccessTokenSilently } = useAuth0()
  return useQuery(
    ["type", "templates", id],
    () =>
      getAccessTokenSilently()
      .then(tkn =>
        fetchWithError(`/v2end/type/templates/${id}`, {
          headers: { Authorization: `Bearer ${tkn}`}
        })),
    options
  )
}