import { useQuery, useQueryClient } from "react-query"

export const useUserFacetTemplates = userId => {
  const queryClient = useQueryClient();
  return useQuery(
    ["user", "facet", "template", userId],
    () => fetch(`/api/user/facet/template/${userId}`)
    .then(res => res.json())
    .then(templates => {
      templates.forEach(tmp => {
        queryClient.setQueryData(
          ["facet", "template", tmp.id],
          tmp
        )
      })
      return templates
    })
  )
}