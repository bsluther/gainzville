import { pipe, concat, remove } from "ramda"
import { createContext, useReducer } from "react"
import * as L from "partial.lenses"

export const FacetTemplateContext = createContext()

const templateLens = ["template"]
const hasChangedLens = ["hasChanged"]
const isNewLens = ["isNew"]
const isDraftLens = ["isDraft"]

const reducer = (state, action) => {
  // console.log("Store: ", state)
  // console.log("Action: ", action)
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
        L.set(isDraftLens, true),
      )(state)

    case "initializeDraft":
      return pipe(
        L.set(templateLens, action.payload),
        L.set(hasChangedLens, false),
        L.set(isNewLens, true),
        L.set(isDraftLens, true),
      )(state)

    case "setName":
      return pipe(
        L.set(concat(templateLens)(["name"]), action.payload),
        L.set(hasChangedLens, true)
      )(state)

    case "appendField":
      return pipe(
        L.modify(concat(templateLens)(["fields"]), prev => prev.concat(action.payload)),
        L.set(hasChangedLens, true)
      )(state)

    case "removeField":
      return pipe(
        L.modify(concat(templateLens)
                       (["fields"]))
                (remove(action.payload.index)(1))
      )(state)

    case "updateField":
      return pipe(
        L.set(concat(templateLens)
                    (["fields", action.payload.index]))
             (action.payload.templateId)
      )(state)
    
    default:
      console.log("unrecognized action: ", action)
      return state
  }
}

export const useFacetTemplateReducer = initialState =>
  useReducer(reducer, initialState)