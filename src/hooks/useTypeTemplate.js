import { useQuery } from "react-query"



export const useTypeTemplate = (id, options) => {
  const typeTemplateQuery = useQuery(
    ["type", "template", id],
    () => fetch(`/api/type/template/${id}`)
          .then(res => res.json()),
    options
  )

  return typeTemplateQuery
}
