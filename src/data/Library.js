import * as L from "partial.lenses"
import { filter, not } from "ramda"


export const appendElement = el => lib =>
  L.modify(["elements"])
          (prev => prev.includes(el) ? prev : prev.concat(el))
          (lib)

export const removeElement = el => lib =>
  L.modify(["elements"])
          (filter(x => x !== el))
          (lib)