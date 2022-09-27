import { identity } from "ramda"
import * as L from "partial.lenses"
import { useEffect } from "react"
import { constructType } from "../../../data/typeConstructor/typeConstructor"
import { useAuth0 } from "@auth0/auth0-react"
import { createContext } from "react"
import { TypeTemplatePresenter } from "./TypeTemplatePresenter"
import { useInsertEntity } from "../../../hooks/queries/entity/useInsertEntity"
import { templateLens, useTypeTemplateReducer } from "../../../state/typeTemplateReducer"

const TypeTemplateContext = createContext()
TypeTemplateContext.getField = fieldName =>  L.get([...templateLens, fieldName])

export const TypeTemplateController = ({ typeTemplateId, constructorId, handleSave = identity }) => {
  const { user } = useAuth0()
  const [store, dispatch] = useTypeTemplateReducer({})
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
  }, [Object.keys(store).length === 0])

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

