import { useMutation, useQueryClient } from "react-query"

export const useUpdateActivityInstance = () => {
  const queryClient = useQueryClient()
  return useMutation(
    instance =>
      fetch(`/api/activity/instance/${instance.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(instance)
      })
      .then(res => res.json()),
    {
      onMutate: instance => {
        const prevInstance = queryClient.getQueryData(
          ["activity", "instance", instance.id]
        )
        queryClient.setQueryData(
          ["activity", "instance", instance.id],
          instance
        )
        return () => setQueryData(
          ["activity", "instance", instance.id],
          prevInstance
        )
      }
    }
  )
}