import { useAuth0 } from "@auth0/auth0-react"
import { append, fromPairs, zip } from "ramda"
import { useQueries } from "react-query"
import { fetchWithError, lookupTypeQueryKey, typeofId } from "../../../utility/fns"


export const useEntities = (ids = [], options) => {
  const { getAccessTokenSilently } = useAuth0()

  const queries = useQueries(
    ids.map(id => {
      const entityType = typeofId(id)
      const queryKey = append(id)
                             (lookupTypeQueryKey(entityType) ?? [])
      const url = `/v2end/${queryKey.join("/")}`

      return ({
        queryKey,
        queryFn: () =>
          getAccessTokenSilently()
          .then(tkn => 
            fetchWithError(url, { headers: { Authorization: `Bearer ${tkn}` } })),
        staleTime: 5 * 60 * 1000,
        ...options
      })
    })
  )

  const queryTable = fromPairs(zip(ids)(queries))

  return queryTable
}