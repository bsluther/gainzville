import { useQuery, useQueryClient } from "react-query"
import { fetchWithError } from "../../utility/fns"

export const useUserActivityPairs = user => {
  const queryClient = useQueryClient()
  const pairsQ = useQuery(
    ["user", "activity", "pairs", user],
    () =>
      fetchWithError(`/api/user/activity/pair/${user}`)
      .then(({ instances, templates }) => {
        instances.forEach(inst =>
          queryClient.setQueryData(
            ["activity", "instance", inst.id],
            inst
          ))
        templates.forEach(tmpl =>
          queryClient.setQueryData(
            ["activity", "template", tmpl.id],
            tmpl
          ))
        return ({ instances, templates })
      })
  )
console.log('pairsQ', pairsQ)
  return pairsQ
}