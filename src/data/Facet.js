import { any, zip } from "ramda"
import { typeToString } from "./typeTemplate/TypeTemplate"

export const facetToString = ({ facetTemplate, facetInstance, typeTemplates = [] }) => {

  if (any(tmpl => tmpl.id === "typ-t-p-boolean")(typeTemplates)) {
    const value = facetInstance.fields.find(fld => fld.template === "typ-t-p-boolean").value
    return value ? facetTemplate.name : `not ${facetTemplate.name}`
  }
  
  const tuples = zip(facetInstance.fields)(typeTemplates)
  const strings = tuples.map(([typeInstance, typeTemplate]) => {
    return typeToString(typeInstance)(typeTemplate)
  })

  return strings.join(" ")
}