import { useQuery } from "react-query"


export const useActivityTemplates = () => {
  const activitiesTemplateQuery = useQuery(
    ["activity", "template"],
    () => fetch("/api/activity/template")
          .then(res => res.json())
  )

  return activitiesTemplateQuery
}

