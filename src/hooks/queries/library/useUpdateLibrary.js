import { useAuth0 } from "@auth0/auth0-react"
import { useMutation, useQueryClient } from "react-query"
import { fetchWithError } from "../../../utility/fns"

export const useUpdateLibrary = options => {
  const { getAccessTokenSilently, user } = useAuth0()
  const queryClient = useQueryClient()

  return useMutation(
    library =>
      getAccessTokenSilently()
      .then(tkn => {
        return fetchWithError(`/v2end/libraries/${library.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tkn}`
          },
          body: JSON.stringify(library)
        })
      }),
    {
      ...options,
      onMutate: library => {
        let cleanup;
        if (typeof options?.onMutate === "function") {
          cleanup = options.onMutate(library) 
        }

        const prev = queryClient.getQueryData(
          ["libraries", library.id]
        )

        queryClient.setQueryData(
          ["libraries", library.id],
          library
        )

        return () => {
          cleanup()
          console.log("rtest!")
          setQueryData(
            ["libraries", library.id],
           prev)
        }
      },
      onSuccess: () => {
        if (typeof options?.onSuccess === "function") {
          options?.onSuccess()
        }
        queryClient.invalidateQueries(["users", user?.sub, "libraries"])
      },
      onError: (x, y, rollback) => {
        rollback()
      }
    }
  )
}