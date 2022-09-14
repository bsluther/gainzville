import { allSucceeded } from "../../../utility/fns"
import { useTypeTemplates } from "../type/useTypeTemplates"
import { useFacetTemplatesById } from "./useFacetTemplates"
import * as L from "partial.lenses"
import { useEntities } from "../entity/useEntities"

import { sequence, map, Nothing, Just, Maybe } from "sanctuary"
import { StrMap } from "sanctuary-def"
import { pipe, prop, values } from "ramda"
import { facetToString } from "../../../data/Facet"


export const useFacetStrings = (facetsObj = {}) => {
  const facetIds = Object.keys(facetsObj)
  const facetTemplatesQ = useEntities(facetIds, { enabled: facetIds.length > 0})

  const typeTemplateIds = [...new Set(L.collect([L.children, "fields", L.elems, "template"], facetsObj))]
  const typeTemplatesQ = useEntities(typeTemplateIds)

  if (false || false) console.log("IFING")
  if (!allSucceeded(Object.values(facetTemplatesQ).concat(Object.values(typeTemplatesQ)))) {
    return ""
  }

  const res = pipe(
    values,
    map(prop("data")),
    map(tmpl => {
      return facetToString({
        facetTemplate: tmpl,
        facetInstance: facetsObj[tmpl.id],
        typeTemplates: map(prop("data"))(typeTemplatesQ)
      })
    })
  )(facetTemplatesQ)

  return res.join(" ")
  // console.log(res)
}