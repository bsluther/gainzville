import { useAuth0 } from "@auth0/auth0-react"
import { append, join, last, tail } from "ramda"
import { useMutation, useQueryClient } from "react-query"
import { fetchWithError, lookupTypeQueryKey, typeofId } from "../../../utility/fns"

// const rejectAndThrow = 

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
        console.log('deleting entity', deletingEntity)

        const collectionQueries = queryClient.getQueriesData({ queryKey: typeQueryKey, predicate: qry => {
          // console.log(last(qry.queryKey))
          return typeof last(qry.queryKey) === "object"
        }})
        console.log('collectionQueries', collectionQueries)
        
        queryClient.removeQueries(queryKey, { exact: true })
        queryClient.setQueriesData(
          {
            queryKey: typeQueryKey,
            predicate: qry => typeof last(qry.queryKey) === "object"
          },
          prev =>  prev?.filter(entity => entity.id !== entityId)
        )

        return () => {
          console.log("rollin back!")
          queryClient.setQueryData(queryKey, deletingEntity)
          queryClient.setQueriesData(
            {
              queryKey: typeQueryKey,
              predicate: qry => {
                console.log('pred!', qry)
                return typeof last(qry.queryKey) === "object"
              },
            },
            prev => {
              console.log('prev', prev)
              return Array.isArray(prev)
                // ? prev.concat(deletingEntity)
                ? prev.find(entity => entity.id === entityId)
                  ? prev
                  : prev.concat(deletingEntity)
                : prev
            }
          )
        }
      },
      onError: (err, variables, rollback) => rollback()
      // onSuccess: (_, variables) => {
      //   queryClient.invalidateQueries(lookupTypeQueryKey(typeofId(variables)))
      // }
    }
  )
}