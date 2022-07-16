import { useMutation, useQueryClient } from "react-query"

export const useDeleteActivityInstance = () => {
  const queryClient = useQueryClient()
  return useMutation(
    instanceId =>
      fetch(`/api/activity/instance/${instanceId}`, {
        method: "DELETE",
        headers: { "content-type": "application/json" }
      })
      .then(res => res.json()),
      {
        onMutate: instanceId => {
          const deletingInstance = queryClient.getQueryData(["activity", "instance", instanceId])

          queryClient.removeQueries(
            ["activity", "instance", instanceId],
            { exact: true }
          )
          queryClient.setQueryData(
            ["user", "activity", "instance"],
            prev => prev.filter(inst => inst.id !== instanceId)
          )

          return () => {
            queryClient.setQueryData(
              ["activity", "instance", instanceId],
              deletingInstance
            )

            queryClient.setQueryData(
              ["user", "activity", "instance"],
              prev => prev.concat(deletingInstance)
            )
          }
        },
        onError: (error, variables, rollback) => rollback()
      }
  )
}