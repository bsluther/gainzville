import { useMutation, useQueryClient } from "react-query"
import { fetchWithError } from "../../../../utility/fns"
import { useAuth0 } from "@auth0/auth0-react"

export const useInsertActivityInstance = () => {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  return useMutation(
    instance => {
      return getAccessTokenSilently()
             .then(tkn =>
               fetchWithError("/v2end/activity/instances", {
                 method: "POST",
                 headers: {
                   "Content-Type": "application/json",
                   "Authorization": `Bearer ${tkn}`
                 },
                 body: JSON.stringify(instance),
             }))
    },
    {
      onMutate: instance => {
        queryClient.setQueryData(
          ["activity", "instances", instance.id],
          instance
        )

        queryClient.setQueryData(
          ["activity", "instances", "actor"],
          prev => prev ? prev.concat(instance) : [instance]
        )

        return () => {
          queryClient.setQueryData(
            ["activity", "instances", "actor"],
            prev => prev.filter(inst => inst !== instance.id)
          )
          queryClient.removeQueries(["activity", "instance", instance.id], { exact: true })
        }
      },
      onError: (error, variables, rollback) => rollback()
    }
      
  )
}