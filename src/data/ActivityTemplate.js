import { makeId } from "../utility/fns"
import { DateTime } from "luxon"

export const constructInstance = (templateId, user) => {
  const id = makeId("act-i-")

  return ({
    _id: id,
    id,
    template: templateId,
    user,
    createdAt: DateTime.now().toISO(),
    facets: {}
  })
}