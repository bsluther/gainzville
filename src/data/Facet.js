import { any, map, zip } from "ramda"
import { typeToString } from "./typeTemplate/TypeTemplate"

export const facetToString = ({ facetTemplate, facetInstance, typeTemplates = [] }) => {
  // console.log(facetInstance)
  if (any(tmpl => tmpl.id === "typ-t-p-boolean")(typeTemplates)) {
    const value = facetInstance.fields.find(fld => fld.template === "typ-t-p-boolean").value
    return value ? facetTemplate.name : `not ${facetTemplate.name}`
  }
  
  // const tuples = zip(facetInstance.fields)(typeTemplates)
  const tuples = map(typeInstance => ([typeInstance, typeTemplates[typeInstance.template]]))
                    (facetInstance.fields)
  const strings = tuples.map(([typeInstance, typeTemplate]) => {
    return typeToString(typeInstance)(typeTemplate)
  })

  return strings.join(" ")
}