import { makeId } from "../utility/fns"
import { DateTime } from "luxon"

export const newTemplate = userId => {
  const id = makeId("fct-t")
  return ({
    _id: id,
    id,
    name: "New facet",
    createdBy: userId,
    createdAt: DateTime.now().toISO(),
    fields: []
  })
}