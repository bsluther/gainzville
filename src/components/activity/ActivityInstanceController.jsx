import { useAuth0 } from "@auth0/auth0-react"
import { useEffect } from "react"
import { useActivityInstance } from "../../hooks/activity/useActivityInstance"
import { useActivityTemplate } from "../../hooks/activity/useActivityTemplate"
import { useUpdateActivityInstance } from "../../hooks/activity/useUpdateActivityInstance"
import { useActivityInstanceReducer } from "../../state/activityInstanceReducer"
import { InstanceContext } from "../../state/activityInstanceReducer"
import { makeId } from "../../utility/fns"
import { ActivityInstancePresenter } from "./ActivityInstancePresenter"

export const ActivityInstanceController = ({ instanceId }) => {
  const instanceQ = useActivityInstance(instanceId)
  const templateQ = useActivityTemplate(
    instanceQ.data?.template,
    { enabled: !!instanceQ.data }
  )
  const updateM = useUpdateActivityInstance()
  const [store, dispatch] = useActivityInstanceReducer()

  const handleSave = instance => updateM.mutate(instance)

  useEffect(() => {
    if (instanceQ.isSuccess) {
      if (!store) {
        dispatch({
          type: "initialize",
          payload: instanceQ.data
        })
      }
      if (store?.id !== instanceId) {
        dispatch({
          type: "initialize",
          payload: instanceQ.data
        })
      }
    }
  }, [instanceId, instanceQ.isSuccess, instanceQ.data, store?.id, !store])


  return (
    <InstanceContext.Provider value={[store, dispatch]}>
      {templateQ.isSuccess && store &&
        <ActivityInstancePresenter 
          Context={InstanceContext}
          template={templateQ.data}
          handleSaveChanges={handleSave}
        />}
    </InstanceContext.Provider>
  )
}

const initializeActivityInstance = (templateId, actor) => {
  const id = makeId("act-i")
  return ({
    instance: {
      _id: id,
      id,
      actor,
      template: templateId,
      facets: {}
    },
    hasChanged: true,
    isNew: true
  })
}


export const NewActivityInstanceController = ({ templateId, handleSaveNewInstance }) => {
  const templateQ = useActivityTemplate(templateId)
  const { user: { sub: actorId } } = useAuth0()

  const [store, dispatch] = useActivityInstanceReducer(
    initializeActivityInstance(templateId, actorId)
  )

  return (
    <InstanceContext.Provider value={[store, dispatch]}>
      {templateQ.isSuccess && 
        <ActivityInstancePresenter
          Context={InstanceContext}
          template={templateQ.data}
          handleSaveChanges={handleSaveNewInstance}
        />}
    </InstanceContext.Provider>
  )
}