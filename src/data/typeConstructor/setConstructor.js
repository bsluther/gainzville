import { makeId } from "../../utility/fns"
import { reduce } from "ramda"

export const setConstructor = {
  _id: "typ-c-set",
  id: "typ-c-set",
  type: "TypeConstructor",
  name: "set"
}

export const makeSet = name => strs => {
  const id = makeId("typ-t")

  return ({
    _id: id,
    id,
    type: "TypeTemplate",
    typeConstructor: "typ-c-set",
    elements: reduce((acc, str) =>
                      acc.includes(str)  
                        ? acc
                        : acc.concat(str))
                    ([])
                    (strs),
    name
  })
}