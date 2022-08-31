import { makeId } from "../../utility/fns"
import { reduce } from "ramda"

export const setConstructor = {
  _id: "typ-c-set",
  id: "typ-c-set",
  type: "TypeConstructor",
  name: "powerset"
}

export const makePowerset = ({ name, elements, createdBy }) => {
  const id = makeId("typ-t")

  return ({
    _id: id,
    id,
    type: "TypeTemplate",
    typeConstructor: "typ-c-powerset",
    createdBy,
    elements: reduce((acc, str) =>
                      acc.includes(str)  
                        ? acc
                        : acc.concat(str))
                    ([])
                    (elements),
    name
  })
}