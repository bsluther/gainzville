import { useAuth0 } from "@auth0/auth0-react"
import { append, filter, head, join, last, map, pipe } from "ramda"
import { useMutation, useQueryClient } from "react-query"
import { fetchWithError, lookupTypeQueryKey, typeofId } from "../../../utility/fns"

export const useDeleteEntity = options => {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()

  return useMutation(
    entityId => {
      const queryKey = lookupTypeQueryKey(typeofId(entityId))

      return getAccessTokenSilently()
             .then(tkn =>
                fetchWithError(`/v2end/${join("/")(queryKey)}/${entityId}`, {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${tkn}` }
                }))
    },
    {
      ...options,
      onMutate: entityId => {
        const typeQueryKey = lookupTypeQueryKey(typeofId(entityId))
        const queryKey = append(entityId)(typeQueryKey)

        const deletingEntity = queryClient.getQueryData(queryKey)
        queryClient.removeQueries(queryKey, { exact: true })

        const collectionQueries = queryClient.getQueriesData({ queryKey: typeQueryKey, predicate: qry => {
          return typeof last(qry.queryKey) === "object"
        }})

        const collectionQueryKeys = pipe(
          filter(([queryKey, data]) => !!data),
          map(head)
        )(collectionQueries)

        
        queryClient.removeQueries(queryKey, { exact: true })
        
        queryClient.setQueriesData(
          {
            queryKey: typeQueryKey,
            predicate: qry => typeof last(qry.queryKey) === "object"
          },
          prev =>  prev?.filter(entity => entity.id !== entityId)
        )

        return () => {
          queryClient.setQueryData(queryKey, deletingEntity)

          collectionQueryKeys.forEach(qryKey => {
            queryClient.setQueryData(
              qryKey,
              prev => 
                Array.isArray(prev)
                  ? prev.find(entity => entity.id === entityId)
                    ? prev
                    : prev.concat(deletingEntity)
                  : prev
            )
          })

          queryClient.invalidateQueries(typeQueryKey)
        }
      },
      onError: (err, variables, rollback) => rollback()
      // onSuccess: (_, variables) => {
      //   queryClient.invalidateQueries(lookupTypeQueryKey(typeofId(variables)))
      // }
    }
  )
}