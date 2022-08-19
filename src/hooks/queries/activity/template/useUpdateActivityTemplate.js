import { useAuth0 } from "@auth0/auth0-react"
import { useMutation, useQueryClient } from "react-query"
import { fetchWithError } from "../../../../utility/fns"


export const useUpdateActivityTemplate = options => {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  return useMutation(
    template =>
      getAccessTokenSilently()
      .then(tkn =>
        fetchWithError(`/v2end/activity/templates/${template.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tkn}`
          },
          body: JSON.stringify(template)
        })),
    {
      enabled: isAuthenticated,
      onMutate: template => {
        const prev = queryClient.getQueryData(["activity", "templates", template.id])

        queryClient.setQueryData(
          ["activity", "templates", template.id],
          template
        )

        return () => {
          queryClient.setQueryData(
            ["activity", "templates", template.id],
            prev
          )
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["activity", "template"])
      },
      onError: (error, variables, rollback) => {
        rollback()
      },
      ...options
    }
  )

}