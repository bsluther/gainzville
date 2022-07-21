import { useEffect } from "react"
import { useActivityTemplate } from "../../hooks/activity/useActivityTemplate"
import { useActivityTemplateReducer, ActivityTemplateContext } from "../../state/activityTemplateReducer"
import { ActivityTemplatePresenter } from "./ActivityTemplatePresenter"
import * as ActivityTemplate from "../../data/ActivityTemplate"
import { useInsertActivityTemplate } from "../../hooks/activity/useInsertActivityTemplate"
import { useUpdateActivityTemplate } from "../../hooks/activity/useUpdateActivityTemplate"



export const ActivityTemplateController = ({ templateId }) => {
  const templateQ = useActivityTemplate(templateId, { enabled: templateId !== "new" })
  const [store, dispatch] = useActivityTemplateReducer()
  const insertTemplateM = useInsertActivityTemplate()
  const updateTemplateM = useUpdateActivityTemplate()

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
          payload: ActivityTemplate.newTemplate("dev2")
        })
      }
    }
    
  }, [store, templateQ.isSuccess, templateId])

  const handleSave = templateId === "new"
    ? template => {
        console.log('template', template)
        insertTemplateM.mutate(template)
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