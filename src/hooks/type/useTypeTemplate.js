import { useQuery, useQueries } from "react-query"
import { getPrimitiveTypeTemplate, isPrimitiveId } from "../../data/typeTemplate/TypeTemplate"
import { fetchWithError } from "../../utility/fns"

export const useTypeTemplate = (id, options) => {
  const typeTemplateQuery = useQuery(
    ["type", "template", id],
    () => fetch(`/api/type/template/${id}`)
          .then(res => res.json()),
    options
  )

  return typeTemplateQuery
}

export const useTypeTemplateV2 = (id, options) => {
  return useQuery(
    ["type", "template", id],
    () => {
      if (isPrimitiveId(id)) {
        const template = getPrimitiveTypeTemplate(id)
        return template
          ? Promise.resolve(template)
          : Promise.reject("Error looking up primitive type template.")
      }

      return fetchWithError(`/api/type/template/${id}`)
    },
    options
  )
}

