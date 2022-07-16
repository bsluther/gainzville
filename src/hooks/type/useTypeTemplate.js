import { useQuery, useQueries } from "react-query"
import { getPrimitiveTypeTemplate } from "../../data/typeTemplate/TypeTemplate"


export const useTypeTemplate = (id, options) => {
  const typeTemplateQuery = useQuery(
    ["type", "template", id],
    () => fetch(`/api/type/template/${id}`)
          .then(res => res.json()),
    options
  )

  return typeTemplateQuery
}

const isPrimitiveId = id => id.slice(0, 8) === "typ-t-p-"


export const useTypeTemplates = ids => {
  const queries = useQueries(ids.map(id => ({
    queryKey: ["type", "template", id],
    queryFn: () => {
      const isPrimitive = isPrimitiveId(id)
      if (isPrimitive) {
        return Promise.resolve(getPrimitiveTypeTemplate(id))
      }
      return fetch(`/api/type/template/${id}`).then(res => res.json())
    }
  })))

  return queries
}


