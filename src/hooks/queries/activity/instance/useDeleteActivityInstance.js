import { useAuth0 } from "@auth0/auth0-react"
import { useMutation, useQueryClient } from "react-query"
import { fetchWithError } from "../../../../utility/fns"

export const useDeleteActivityInstance = () => {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently, user } = useAuth0()

  return useMutation(
    instanceId =>
      getAccessTokenSilently()
      .then(tkn =>
        fetchWithError(`/v2end/activity/instances/${instanceId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${tkn}` }
        })
      ),
      {
        onMutate: instanceId => {
          const deletingInstance = queryClient.getQueryData(["activity", "instance", instanceId])

          queryClient.removeQueries(
            ["activity", "instances", instanceId],
            { exact: true }
          )
          queryClient.setQueryData(
            ["activity", "instances", { actor: user.sub }],
            prev => prev ? prev.filter(inst => inst.id !== instanceId) : []
          )

          return () => {
            queryClient.setQueryData(
              ["activity", "instances", instanceId],
              deletingInstance
            )

            queryClient.setQueryData(
              ["activity", "instances", { actor: user.sub }],
              prev => prev ? prev.concat(deletingInstance) : []
            )
          }
        },
        onError: (error, variables, rollback) => rollback()
      }
  )
}