import { useMutation, useQueryClient } from "react-query"
import { fetchWithError } from "../../utility/fns"

export const useInsertFacetTemplate = user => {
  const queryClient = useQueryClient()

  return useMutation(
    template => {
      return fetchWithError("/api/facet/template", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(template),
      })
    },
    {
      onMutate: template => {
        queryClient.setQueryData(
          ["facet", "template", template.id],
          template
        )

        queryClient.setQueryData(
          ["user", "facet", "template", user],
          prev => (prev.concat(template))
        )

        return () => {
          queryClient.setQueryData(
            ["user", "facet", "template"],
            prev => prev.filter(inst => inst !== template.id)
          )
          queryClient.removeQueries(["facet", "template", template.id], { exact: true })
        }
      },
      onError: (error, variables, rollback) => rollback()
    }
      
  )
}