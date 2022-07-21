import { makeId } from "../utility/fns"

export const newTemplate = userId => {
  const id = makeId("fct-t")
  return ({
    _id: id,
    id,
    name: "",
    createdBy: userId,
    fields: []
  })
}