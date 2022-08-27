import { useAuth0 } from "@auth0/auth0-react"
import { useMutation, useQueryClient } from "react-query"
import { callIfFn, fetchWithError } from "../../../utility/fns"



export const useInsertLibrary = options => {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0()
  const queryClient = useQueryClient()

  return useMutation(
    lib =>
      getAccessTokenSilently()
      .then(tkn =>
        fetchWithError(`/v2end/libraries`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tkn}`
          },
          body: JSON.stringify(lib)
        })
        .then(() =>
          fetchWithError(`/v2end/users/${user?.sub}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tkn}`
            },
            body: JSON.stringify({
              $addToSet: { libraries: lib.id }
            })
          }))),
    {
      ...options,
      enabled: isAuthenticated,
      onSettled: (...args) => {
        callIfFn(options?.onSettled)(args)

        queryClient.invalidateQueries(["libraries"])
      }
    }
  )
}