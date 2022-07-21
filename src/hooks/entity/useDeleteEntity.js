import { useMutation, useQueryClient } from "react-query"
import { isPrimitive } from "../../data/typeTemplate/TypeTemplate"
import fetchWithError from "../../utility/fns"


const determineTypePrefix = id => {
  const hash = {
    "act-": "activity",
    "fct-": "facet",
    "typ-": "type"
  }

  return hash[id.slice(0, 4)] ?? "INDETERMINATE"
}

const determineTypeSuffix = id => {
  const hash = {
    "t-": "template",
    "i-": "instance"
  }
  return hash[id.slice(4, 6)] ?? "INDETERMINATE"
}

const isPrimitiveTypeTemplateId = id =>
  id.slice(0, 8) === "typ-t-p-"

const makeIdentifierHash = id => ({
  prefix: determineTypePrefix(id),
  suffix: determineTypeSuffix(id),
  id
})


export const useDeleteEntity = () => {
  const queryClient = useQueryClient()

  return useMutation(
    ({ type, subtype, id}) =>
      fetchWithError(`/api/${determineEntityType(id)}/${determineEntitySubtype(id)}/${id}`, {
        method: "DELETE",
        headers: { "content-type": "application/json" }
      }),
    {
      onMutate: id => {
      const type = determineEntityType(id)
      const subtype = determineEntitySubtype(id)
      const deletedEntity = queryClient.getQueryData([type, subtype, id])
    }}
  )
}