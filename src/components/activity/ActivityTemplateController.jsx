import { useEffect } from "react"
import { useActivityTemplateReducer, ActivityTemplateContext } from "../../state/activityTemplateReducer"
import * as ActivityTemplate from "../../data/ActivityTemplate"
import { useActivityTemplate } from "../../hooks/queries/activity/template/useActivityTemplate"
import { useInsertActivityTemplate } from "../../hooks/queries/activity/template/useInsertActivityTemplate"
import { useReplaceActivityTemplate } from "../../hooks/queries/activity/template/useReplaceActivityTemplate"

import { ActivityTemplatePresenter } from "./ActivityTemplatePresenter"
import { typeofId } from "../../utility/fns"
import { useAuth0 } from "@auth0/auth0-react"



export const ActivityTemplateController = ({ templateId, handleSaveNewTemplate }) => {
  const templateQ = useActivityTemplate(templateId, {
    enabled: typeofId === "ActivityTemplate" 
  })
  const [store, dispatch] = useActivityTemplateReducer()
  const insertTemplateM = useInsertActivityTemplate()
  const updateTemplateM = useReplaceActivityTemplate()
  const { user } = useAuth0()

  useEffect(() => {
    if (templateQ.isSuccess) {
      if (!store) {
        dispatch({
          type: "initialize",
          payload: templateQ.data
        })
      }
      if (store && templateId !== store?.template.id) {
        dispatch({
          type: "initialize",
          payload: templateQ.data
        })
      }
    }

    if (templateId === "new") {
      console.log("STORE", store)
      if (!store || !store.isNew) {
        dispatch({
          type: "initializeNew",
          payload: ActivityTemplate.newTemplate(user?.sub)
        })
      }
    }
    
  }, [store, templateQ.isSuccess, templateId])

  const handleSave = templateId === "new"
    ? template => {
        insertTemplateM.mutate(template)
        handleSaveNewTemplate(template)
      }
    : template => updateTemplateM.mutate(template)


  return (
    <ActivityTemplateContext.Provider value={[store, dispatch]}>
      {store &&
        <ActivityTemplatePresenter
          handleSave={handleSave}
        />}
    </ActivityTemplateContext.Provider>
  )
}