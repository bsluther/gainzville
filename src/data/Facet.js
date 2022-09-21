import { any, map, zip } from "ramda"
import { initializeTypeInstance, typeToString } from "./typeTemplate/TypeTemplate"

export const facetToString = ({ facetTemplate, facetInstance, typeTemplates = {} }) => {

  if (any(id => id === "typ-t-p-boolean")(facetTemplate.fields)) {
    const value = facetInstance.fields.find(fld => fld.template === "typ-t-p-boolean")?.value
    return value ? facetTemplate.name : `not ${facetTemplate.name}`
  }

  const tuples = map(typeInstance => 
                      ([typeInstance, typeTemplates[typeInstance.template]]))
                    (facetInstance.fields)
  const strings = tuples.map(([typeInstance, typeTemplate]) => {
    return typeToString(typeInstance)(typeTemplate)
  })

  return strings.join(" ")
}

export const initializeFacetInstance = facetTemplate => typeTemplateTable => ({
  fields: map(typeTemplateId => initializeTypeInstance(typeTemplateTable[typeTemplateId]))
             (facetTemplate.fields)
})