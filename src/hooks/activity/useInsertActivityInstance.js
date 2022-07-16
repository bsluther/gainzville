import { useMutation, useQueryClient } from "react-query"
import fetchWithError from "../../utility/fns"

export const useInsertActivityInstance = () => {
  const queryClient = useQueryClient()

  return useMutation(
    instance => {
      return fetchWithError("/api/activity/instance", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(instance),
      })
    },
    {
      onMutate: instance => {
        queryClient.setQueryData(
          ["activity", "instance", instance.id],
          instance
        )

        queryClient.setQueryData(
          ["user", "activity", "instance"],
          prev => (prev.concat(instance))
        )

        return () => {
          queryClient.setQueryData(
            ["user", "activity", "instance"],
            prev => prev.filter(inst => inst !== instance.id)
          )
          queryClient.removeQueries(["activity", "instance", instance.id], { exact: true })
        }
      },
      onError: (error, variables, rollback) => rollback()
    }
      
  )
}