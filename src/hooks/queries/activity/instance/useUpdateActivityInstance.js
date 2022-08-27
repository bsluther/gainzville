import { useAuth0 } from "@auth0/auth0-react"
import { useMutation, useQueryClient } from "react-query"
import { fetchWithError } from "../../../../utility/fns"


export const useUpdateActivityInstance = () => {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0()
  const queryClient = useQueryClient()

  return useMutation(
    instance =>
      getAccessTokenSilently()
      .then(tkn =>
        fetchWithError(`/v2end/activity/instances/${instance.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tkn}`,
          },
          body: JSON.stringify(instance)
        })),
    {
      enabled: isAuthenticated,
      onMutate: instance => {
        const prevInstance = queryClient.getQueryData(
          ["activity", "instances", instance.id]
        )
        queryClient.setQueryData(
          ["activity", "instances", instance.id],
          instance
        )

        return () =>
          setQueryData(
            ["activity", "instances", instance.id],
            prevInstance
          )
      },
      onSettled: () =>
        queryClient.invalidateQueries(["activity", "instances", "actor", user?.sub])
    }
  )
}