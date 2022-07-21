import { findIndex, update } from "ramda"
import { useMutation, useQueryClient } from "react-query"

export const useUpdateActivityTemplate = () => {
  const queryClient = useQueryClient()
  return useMutation(
    template =>
      fetch(`/api/activity/template/${template.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(template)
      })
      .then(res => res.json()),
    {
      onMutate: template => {
        const prevTemplate = queryClient.getQueryData(
          ["activity", "template", template.id]
        )

        queryClient.setQueryData(
          ["activity", "template", template.id],
          template
        )

        queryClient.setQueryData(
          ["activity", "template"],
          prev => {
            if (Array.isArray(prev)) {
              const ix = findIndex(tmpl => tmpl.id === template.id)(prev)
              if (ix === -1) {
                return prev.concat(template)
              }
              return update(ix)(template)(prev)
            }
            return [template]
          }
        )

        return () => {
          setQueryData(
            ["activity", "template", template.id],
            prevTemplate
          )
          setQueryData(
            ["activity", "template"],
            prev =>
              Array.isArray(prev)
                ? prev.filter(tmpl => tmpl.id !== template.id)
                : []
          )
        }
      }
    }
  )
}