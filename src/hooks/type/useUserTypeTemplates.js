import { useQuery, useQueryClient } from "react-query"
import { primitives } from "../../data/typeTemplate/TypeTemplate"
import { isPrimitiveId } from "../../data/typeTemplate/TypeTemplate"
import { fetchWithError } from "../../utility/fns"

export const useUserTypeTemplates = userId => {
  const queryClient = useQueryClient()
  return useQuery(
    ["user", "type", "template", userId],
    // () => Promise.resolve(primitives),
    () => 
      fetchWithError(`/api/user/type/template/${userId}`)
      .then(data => primitives.concat(data)),
    {
      onSuccess: templates => {
        templates.forEach(tmpl => {
          queryClient.setQueryData(
            ["type", "template", tmpl.id],
            tmpl
          )
        })
      }
    }
  )
}