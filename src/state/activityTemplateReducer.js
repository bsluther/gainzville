import { pipe, concat } from "ramda"
import { createContext, useReducer } from "react"
import * as L from "partial.lenses"

export const ActivityTemplateContext = createContext()

const templateLens = ["template"]
const hasChangedLens = ["hasChanged"]
const isNewLens = ["isNew"]
// isDraft is the renamed isNew property, isNew needs to be migrated in older usages
const isDraftLens = ["isDraft"]

const reducer = (state, action) => {
  switch (action.type) {
    case "initialize":
      return pipe(
        L.set(templateLens, action.payload),
        L.set(hasChangedLens, false)
      )({})

    case "initializeNew":
      return pipe(
        L.set(templateLens, action.payload),
        L.set(hasChangedLens, false),
        L.set(isNewLens, true),
        L.set(isDraftLens, true)
      )(state)

    case "input":
      return pipe(
        L.set(concat(templateLens)(action.payload.address), action.payload.value),
        L.set(hasChangedLens, true)
      )(state)
    
    default:
      console.log("unrecognized action: ", action)
      return state
  }
}

export const useActivityTemplateReducer = initialState =>
  useReducer(reducer, initialState)