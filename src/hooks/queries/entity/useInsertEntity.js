import { useAuth0 } from "@auth0/auth0-react"
import { join } from "ramda"
import { useMutation, useQueryClient } from "react-query"
import { fetchWithError, lookupTypeQueryKey, typeofId } from "../../../utility/fns"


export const useInsertEntity = options => {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()

  return useMutation(
    entity => {
      const queryKey = lookupTypeQueryKey(typeofId(entity.id))

      return getAccessTokenSilently()
             .then(tkn =>
                fetchWithError(`/v2end/${join("/")(queryKey)}`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tkn}`
                  },
                  body: JSON.stringify(entity)
                }))
    },
    {
      ...options,
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(lookupTypeQueryKey(typeofId(variables.id)))
      }
    }
  )
}