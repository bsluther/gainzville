import { head } from "ramda"
import * as L from "partial.lenses"

export const getElements = L.get(["elements"])

export const initializeSetInstance = template => ({
  type: "TypeInstance",
  template: template.id,
  value: head(getElements(template)) ?? ""
})