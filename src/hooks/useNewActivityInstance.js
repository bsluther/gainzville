import { useMutation } from "react-query"
import { useActivityTemplate } from "./useActivityTemplate"

const initializeActivityInstance = templateId => ({
  template: templateId,
  facets: []
})

export const useNewActivityInstance = templateId => {
  const templateQ = useActivityTemplate(templateId)
  const createInstanceM = useMutation(id => fetch(`/api/activity/instance/${id}`, {
    method: "CREATE",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(initializeActivityInstance(id))
  }))
}