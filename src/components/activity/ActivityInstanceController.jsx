import { useAuth0 } from "@auth0/auth0-react"
import { prop } from "ramda"
import { useEffect, useLayoutEffect } from "react"
import { useActivityInstance } from "../../hooks/queries/activity/instance/useActivityInstance"
import { useActivityTemplate } from "../../hooks/queries/activity/template/useActivityTemplate"
import { useUpdateActivityInstance } from "../../hooks/queries/activity/instance/useUpdateActivityInstance"
import { getInstance, useActivityInstanceReducer } from "../../state/activityInstanceReducer"
import { InstanceContext } from "../../state/activityInstanceReducer"
import { makeId } from "../../utility/fns"
import { ActivityInstancePresenter } from "./ActivityInstancePresenter"
import { DateTime } from "luxon"

export const ActivityInstanceController = ({ instanceId }) => {
  const instanceQ = useActivityInstance(instanceId)
  const templateQ = useActivityTemplate(
    instanceQ.data?.template,
    { enabled: !!instanceQ.data }
  )
  const updateM = useUpdateActivityInstance()

  const [store, dispatch] = useActivityInstanceReducer()

  const handleSave = instance => updateM.mutate(instance)

  useLayoutEffect(() => {
    if (instanceQ.isSuccess) {
      if (!store?.instance) {
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
      _id: id,
      id,
      createdAt: DateTime.now().toISO(),
      actor,
      template: templateId,
      facets: {}
    })
}


export const NewActivityInstanceController = ({ templateId, handleSaveNewInstance }) => {
  const templateQ = useActivityTemplate(templateId)
  const { user } = useAuth0()

  const [store, dispatch] = useActivityInstanceReducer()

  useEffect(() => {
    dispatch({
      type: "initialize",
      payload: initializeActivityInstance(templateId, user?.sub)
    })
  }, [user?.sub])

  const instanceTemplate = prop("template")
                               (getInstance(store))

  useEffect(() => {
    if (instanceTemplate !== templateId) {
      dispatch({
        type: "initialize",
        payload: initializeActivityInstance(templateId, user?.sub)
      })
    }
  }, [instanceTemplate, user?.sub, templateId])

  return (
    <InstanceContext.Provider value={[store, dispatch]}>
      {templateQ.isSuccess && 
        <ActivityInstancePresenter
          Context={InstanceContext}
          template={templateQ.data}
          handleSaveChanges={instance => {
            dispatch({ type: "clearData" })
            handleSaveNewInstance(instance)
          }}
        />}
    </InstanceContext.Provider>
  )
}