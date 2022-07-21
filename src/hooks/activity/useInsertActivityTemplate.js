import { useMutation, useQueryClient } from "react-query"
import fetchWithError from "../../utility/fns"

export const useInsertActivityTemplate = () => {
  const queryClient = useQueryClient()

  return useMutation(
    template => {
      return fetchWithError("/api/activity/template", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(template),
      })
    },
    {
      onMutate: template => {
        queryClient.setQueryData(
          ["activity", "template", template.id],
          template
        )

        queryClient.setQueryData(
          ["user", "activity", "template"],
          prev => (Array.isArray(prev) ? prev.concat(template) : [template])
        )

        return () => {
          queryClient.setQueryData(
            ["user", "activity", "template"],
            prev => prev.filter(inst => inst !== template.id)
          )
          queryClient.removeQueries(["activity", "template", template.id], { exact: true })
        }
      },
      onError: (error, variables, rollback) => rollback()
    }
      
  )
}