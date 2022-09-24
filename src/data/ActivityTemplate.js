import { makeId, snakeToSpace } from "../utility/fns"
import { DateTime } from "luxon"
import * as L from "partial.lenses"

const constructInstance = (templateId, user) => {
  const id = makeId("act-i")

  return ({
    _id: id,
    id,
    template: templateId,
    user,
    createdAt: DateTime.now().toISO(),
    facets: {}
  })
}

export const newTemplate = user => {
  const id = makeId("act-t")
  return ({
    _id: id,
    id,
    createdBy: user,
    name: "New activity",
    aliases: []
  })
}

export const name = L.get(["name"])