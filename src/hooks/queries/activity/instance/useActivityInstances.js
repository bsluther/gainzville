import { useAuth0 } from "@auth0/auth0-react"
import { useQuery, useQueryClient } from "react-query"
import { callIfFn, fetchWithError } from "../../../../utility/fns"
import { DateTime } from "luxon"


export const useActivityInstances = (queryObj, options) => {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  const paramString = new URLSearchParams(queryObj).toString()

  return useQuery(
    ["activity", "instances", queryObj],
    () =>
      getAccessTokenSilently()
      .then(tkn =>
        fetchWithError(`/v2end/activity/instances?${paramString}`, {
          headers: { Authorization: `Bearer ${tkn}` }
        })),
    {
      onSuccess: instances => {
        callIfFn(options?.onSuccess)(instances)
        
        instances.forEach(inst => {
          queryClient.setQueryData(
            ["activity", "instances", inst.id],
            inst,
            { updatedAt: DateTime.now().toUnixInteger() }
          )
        })
      },
      ...options
    }
  )
}