import { useAuth0 } from "@auth0/auth0-react"
import { useMutation, useQueryClient } from "react-query"
import { fetchWithError } from "../../../../utility/fns"

export const useInsertActivityTemplate = options => {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  return useMutation(
    template =>
      getAccessTokenSilently()
      .then(tkn =>
        fetchWithError(`/v2end/activity/templates`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tkn}`
          },
          body: JSON.stringify(template)
        })),
    {
      ...options,
      onSuccess: () => {
        if (typeof options?.onSuccess === "function") { options.onSuccess() }
        queryClient.invalidateQueries(["activity", "templates"])
      }
    }
  )
}