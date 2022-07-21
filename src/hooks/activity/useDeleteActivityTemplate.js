import { useMutation, useQueryClient } from "react-query"

export const useDeleteActivityTemplate = () => {
  const queryClient = useQueryClient()
  return useMutation(
    templateId =>
      fetch(`/api/activity/template/${templateId}`, {
        method: "DELETE",
        headers: { "content-type": "application/json" }
      })
      .then(res => res.json()),
      {
        onMutate: templateId => {
          const deletingTemplate = queryClient.getQueryData(["activity", "template", templateId])

          queryClient.removeQueries(
            ["activity", "template", templateId],
            { exact: true }
          )

          queryClient.setQueryData(
            ["activity", "template"],
            prev => prev.filter(inst => inst.id !== templateId)
          )

          return () => {
            queryClient.setQueryData(
              ["activity", "template", templateId],
              deletingTemplate
            )

            queryClient.setQueryData(
              ["user", "activity", "template"],
              prev => prev.concat(deletingTemplate)
            )
          }
        },
        onError: (error, variables, rollback) => rollback()
      }
  )
}