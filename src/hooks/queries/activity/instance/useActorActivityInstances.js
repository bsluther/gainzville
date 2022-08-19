import { useQuery, useQueryClient } from "react-query"
import { useAuth0 } from "@auth0/auth0-react"
import { fetchWithError } from "../../../../utility/fns"


export const useActorActivityInstances = () => {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0()

  const instancesQ = useQuery(
    ["activity", "instances", "actor", user?.sub],
    () => 
      getAccessTokenSilently()
      .then(
        tkn =>
          fetchWithError(
            `/v2end/activity/instances/actor/${user?.sub}`,
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tkn}`
              }
            }
          )
      ),
    { enabled: isAuthenticated }
  )

  return instancesQ
}

