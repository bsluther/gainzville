import * as L from "partial.lenses"
import { filter } from "ramda"
import { makeId } from "../utility/fns"
import { DateTime } from "luxon"

export const appendElement = el => lib =>
  L.modify(["elements"])
          (prev => prev.includes(el) ? prev : prev.concat(el))
          (lib)

export const removeElement = el => lib =>
  L.modify(["elements"])
          (filter(x => x !== el))
          (lib)

export const setLibraryName = name => lib =>
  L.set(["name"])
       (name)
       (lib)

export const constructLibrary = userId => name => {
  const id = makeId("lib")
  return ({
    _id: id,
    id,
    name: name ?? "New library",
    createdAt: DateTime.now().toISO(),
    createdBy: userId,
    elements: []
  })
}