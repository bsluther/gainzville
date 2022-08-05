import { useQuery, useQueryClient } from "react-query"


export const useUserActivityInstances = user => {
  const queryClient = useQueryClient()
  return useQuery(
    ["user", "activity", "instance"],
    () => 
      fetch(`/api/user/activity/instance/${user}`)
      .then(res => res.json())
      .then(instances => {
        instances.forEach(instance => 
          queryClient.setQueryData(
            ["activity", "instance", instance.id],
            instance
          ))
        return instances
      })
  )
}