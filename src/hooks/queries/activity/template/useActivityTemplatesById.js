import { useQueries } from "react-query"
import { fetchWithError } from "../../../../utility/fns"


export const useActivityTemplatesById = (ids = [], options) => {
  const templateQs = useQueries(
    ids.map(id => ({
      queryKey: ["activity", "templates", id],
      queryFn: () =>
        fetchWithError(`/v2end/activity/templates/${id}`),
      options: options
    }))
  )

  return templateQs
}