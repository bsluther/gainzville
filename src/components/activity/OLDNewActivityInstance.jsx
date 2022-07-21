import { useActivityTemplate } from "../../hooks/activity/useActivityTemplate"
import { makeId } from "../../utility/fns"
import { useActivityInstanceReducer, getInstance } from "../../state/activityInstanceReducer"
import { ActivityInstancePresenter } from "./ActivityInstancePresenter"

const initializeActivityInstance = (templateId, user) => {
  const id = makeId("act-i")
  return ({
    instance: {
      _id: id,
      id,
      user,
      template: templateId,
      facets: {}
    },
    hasChanged: true,
    isNew: true
  })
}


export const NewActivityInstance = ({ templateId, user, handleSaveNewInstance }) => {
  const [store, dispatch] = useActivityInstanceReducer(
    initializeActivityInstance(templateId, user)
  )
  const templateQ = useActivityTemplate(templateId)

  return (
    <>
      {templateQ.isSuccess && 
        <ActivityInstancePresenter 
          store={store}
          dispatch={dispatch}    
          template={templateQ.data}
          handleSaveChanges={handleSaveNewInstance}
        />}
    </>
  )
}