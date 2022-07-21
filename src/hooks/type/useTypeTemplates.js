import { useQueries } from "react-query"
import { getPrimitiveTypeTemplate } from "../../data/typeTemplate/TypeTemplate"
import { isPrimitiveId } from "../../data/typeTemplate/TypeTemplate"

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