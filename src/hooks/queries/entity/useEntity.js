import { useAuth0 } from "@auth0/auth0-react"
import { append } from "ramda"
import { useQuery } from "react-query"
import { fetchWithError, lookupTypeQueryKey, typeofId } from "../../../utility/fns"

export const useEntity = (id, options) => {
  const { getAccessTokenSilently } = useAuth0()
  const entityType = typeofId(id)
  const queryKey = append(id)(lookupTypeQueryKey(entityType) ?? [])
  const url = `/v2end/${queryKey.join("/")}`

  return useQuery(
    queryKey,
    () =>
      getAccessTokenSilently()
      .then(tkn =>
        fetchWithError(url, {
          headers: { Authorization: `Bearer ${tkn}` }
        })),
    options
  )
}