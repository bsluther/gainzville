import { useAuth0 } from "@auth0/auth0-react"
import { useQueries, useQuery, useQueryClient } from "react-query"
import { fetchWithError } from "../../../utility/fns"

const useLibraries = (ids = [], options) => {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()

  return useQuery(
    ["libraries", { ids }],
    () =>
      getAccessTokenSilently()
      .then(tkn =>
        fetchWithError(
          `/v2end/libraries?id=${ids.toString()}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${tkn}`
            }
          }
        ))
      .then(libs => {
        libs.forEach(lib => 
          queryClient.setQueryData(
            ["library", lib.id],
            lib
          ))
        return libs
      }),
    options
  )
}

const useLibrariesOld = (ids = [], options) => {
  const { getAccessTokenSilently } = useAuth0()

  return useQueries(ids.map(id => ({
    queryKey: ["libraries", id],
    queryFn: () =>
      getAccessTokenSilently()
      .then(
        tkn =>
          fetchWithError(
            `/v2end/libraries/${id}`,
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tkn}`
              }
            }
          ),
        () =>
          fetchWithError(
            `/v2end/libraries/${id}`,
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
          )
    ),
    options
  })))
}