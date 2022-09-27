import { useAuth0 } from "@auth0/auth0-react"
import { useEffect } from "react"
import { constructType } from "../../data/typeConstructor/typeConstructor"
import { useTypeTemplateReducer } from "../../state/typeTemplateReducer"
import { useInsertEntity } from "../queries/entity/useInsertEntity"

export const useTypeTemplateController = (typeTemplateId, constructorId) => {
  const { user } = useAuth0()
  const [store, dispatch] = useTypeTemplateReducer()
  const insertM = useInsertEntity()

  const handleSave = insertM.mutate

  useEffect(() => {
    if (!store) {
      if (typeTemplateId === "DRAFT") {
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
  }, [!store])

  return ({ store, dispatch, handleSave })
} 