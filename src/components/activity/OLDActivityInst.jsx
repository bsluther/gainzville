import { useEffect } from "react"
import { useActivityInstance } from "../../hooks/activity/useActivityInstance"
import { useActivityTemplate } from "../../hooks/activity/useActivityTemplate"
import { useUpdateActivityInstance } from "../../hooks/activity/useUpdateActivityInstance"
import { useActivityInstanceReducer } from "../../state/activityInstanceReducer"
import { ActivityInstancePresenter } from "./ActivityInstancePresenter"


const ActivityInst = ({ instanceId }) => {
  const instanceQ = useActivityInstance(instanceId)
  const templateQ = useActivityTemplate(
    instanceQ.data?.template,
    { enabled: instanceQ.isSuccess }
  )
  const updateM = useUpdateActivityInstance()
  const [store, dispatch] = useActivityInstanceReducer()

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
  }, [instanceId, instanceQ.isSuccess, instanceQ.data])

  return (
    <>
      {templateQ.isSuccess && store &&
        <ActivityInstancePresenter
          store={store}
          dispatch={dispatch}
          template={templateQ.data}
          handleSaveChanges={instance => {
            updateM.mutate(instance)
          }}
        />
      }
    </>
  )
}