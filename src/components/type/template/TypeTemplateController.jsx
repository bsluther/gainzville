import { identity, pipe, remove } from "ramda"
import * as L from "partial.lenses"
import { useEffect, useReducer } from "react"
import { constructType } from "../../../data/typeConstructor/typeConstructor"
import { useAuth0 } from "@auth0/auth0-react"
import { createContext } from "react"
import { TypeTemplatePresenter } from "./TypeTemplatePresenter"
import { useInsertEntity } from "../../../hooks/queries/entity/useInsertEntity"

const templateLens = ["template"]
const nameLens = [...templateLens, "name"]
const elementsLens = [...templateLens, "elements"]
const constructorLens = [...templateLens, "typeConstructor"]

const TypeTemplateContext = createContext()
TypeTemplateContext.getField = fieldName =>  L.get([...templateLens, fieldName])

const typeTemplateReducer = (state, action) => {
  // console.log("Action:", action)
  switch (action.type) {
    case "initialize":
      return pipe(
        L.set(templateLens, action.payload.template)
      )(state)

    case "setName":
      return pipe(
        L.set(nameLens, action.payload)
      )(state)

    case "setConstructor":
      return pipe(
        L.set(constructorLens, action.payload)
      )(state)

    case "appendElement":
      return pipe(
        L.modify(elementsLens)
                (els => 
                  els.includes(action.payload) 
                    ? els 
                    : els.concat(action.payload))
      )(state)

    case "removeElement":
      return pipe(
        L.modify(elementsLens, remove(action.payload, 1))
      )(state)

    case "updateElement":
      return pipe(
        L.set([...elementsLens, action.payload.index], action.payload.element)
      )(state)

    default:
      console.log("Unrecognized typeTemplate action: ", action)
      return state
  }
}

export const TypeTemplateController = ({ typeTemplateId, constructorId, handleSave = identity }) => {
  const { user } = useAuth0()
  const [store, dispatch] = useReducer(typeTemplateReducer, {})
  const insertTypeTemplateM = useInsertEntity() 

  useEffect(() => {
    if (Object.keys(store).length === 0) {
      console.log("empty store")
      if (typeTemplateId === "new") {
        console.log("typeTemplateId === 'new'")
        dispatch({
          type: "initialize",
          payload: {
            template: constructType({
              constructorId,
              createdBy: user?.sub
            }),
            constructor: constructorId
          }
        })
      }
    }
  }, [!store.keys])

  return (
    <TypeTemplateContext.Provider value={[store, dispatch]}>
      {Object.keys(store).length > 0 &&
        <TypeTemplatePresenter 
          Context={TypeTemplateContext} 
          handleSave={tmpl => {
            handleSave(tmpl)
            insertTypeTemplateM.mutate(tmpl)
          }} />}
    </TypeTemplateContext.Provider>
  )
}

