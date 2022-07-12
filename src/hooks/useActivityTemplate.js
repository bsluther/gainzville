import { useQuery } from "react-query"


export const useActivityTemplate = (id, options) => {
  const activityTemplateQuery = useQuery(
    ["activity", "template", id],
    () => fetch(`/api/activity/template/${id}`)
          .then(res => res.json()),
    options
  )

  return activityTemplateQuery
}
