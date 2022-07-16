import * as L from "partial.lenses"
import { append, filter } from "ramda"

export const getValue = L.get(["value", L.valueOr([])])

export const appendElement = el => 
  L.modify(["value"], append(el))

export const removeElement = el =>
  L.modify(["value"], filter(x => x !== el))

export const isElement = str => instance =>
  getValue(instance).includes(str)