import { useAuth0 } from "@auth0/auth0-react"
import { useMutation, useQueryClient } from "react-query"
import { fetchWithError } from "../../../utility/fns"
import * as L from "partial.lenses"
import { propEq } from "ramda"

export const useReplaceLibrary = options => {
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

        const prevLib = queryClient.getQueryData(
          ["libraries", library.id]
        )

        queryClient.setQueryData(
          ["libraries", library.id],
          library
        )
        
        const prevUserLibs = queryClient.getQueryData(
          ["libraries", { user: user?.sub }]
        )

        queryClient.setQueryData(
          ["libraries", { user: user?.sub }],
          prev => {
            const result = L.set(
              [L.find(propEq("id")(library.id))],
              library,
              prev
            )
            return result
          }
        )

        return () => {
          cleanup()
          queryClient.setQueryData(
            ["libraries", library.id],
            prevLib
          )
          queryClient.setQueryData(
            ["libraries", { user: user?.sub }],
            prevUserLibs
          )
        }
      },
      onSuccess: (...args) => {
        if (typeof options?.onSuccess === "function") {
          options?.onSuccess(...args)
        }
        queryClient.invalidateQueries(["users", user?.sub, "libraries"])
      },
      onError: (error, variables, rollback) => {
        rollback()
      }
    }
  )
}