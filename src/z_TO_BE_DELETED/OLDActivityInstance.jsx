import { map } from "ramda"
import { useEffect, useReducer } from "react"
import { useActivityInstance } from "../../hooks/activity/useActivityInstance"
import { useActivityTemplate } from "../../hooks/activity/useActivityTemplate"
import { FacetInstance } from "../facet/FacetInstance"
import { snakeToSpace } from "../../utility/fns"
import { useMutation } from "react-query"
import { reducer, InstanceContext, getInstance } from "../../state/activityInstanceReducer"

function ActivityInstance({ activityInstanceId }) {
  const instanceQ = useActivityInstance(activityInstanceId)
  const templateQ = useActivityTemplate(instanceQ.data?.template, { enabled: instanceQ.isSuccess })
  const [store, dispatch] = useReducer(reducer, null)
  const updateInstance = useMutation(
    instance =>
      fetch(`/api/activity/instance/${instance.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(instance)
      })
      .then(res => res.json())
  )

  console.log("activity instance store", store)
  useEffect(() => {
    if (instanceQ.isSuccess) {
      if (!store) {
        dispatch({ type: 'initialize', payload: instanceQ.data })
      }
      if (store?.id !== activityInstanceId) {
        dispatch({ type: 'initialize', payload: instanceQ.data })
      }
    }
  }, [activityInstanceId, instanceQ.isSuccess])
  

  return (
    <div
      className="
        border-2 border-neutral-800 rounded-md bg-neutral-500
        w-max
        flex flex-col
      "
    >
      {templateQ.isSuccess && instanceQ.isSuccess &&
        <InstanceContext.Provider value={[getInstance(store), dispatch]}>
          <span 
            className="grow font-semibold text-lg text-center 
              bg-neutral-700 text-neutral-400 uppercase
              rounded-t-sm border-b-2 border-neutral-800"
          >
            {snakeToSpace(templateQ.data.name)}
          </span>

          <div className="p-2 space-y-2">
            {map(id => 
                  <FacetInstance 
                    key={id} 
                    facetTemplateId={id} 
                    address={{ facet: id }} 
                  />)
                (Object.keys(instanceQ.data.facets))}
          </div>
          <button
            className={`
              border-2 border-neutral-800 rounded-md
              bg-neutral-600
              px-2 mb-2 mr-2
              w-max
              self-end
              ${store?.hasChanged ? "text-neutral-200 hover:text-yellow-300" : "text-neutral-800"}
            `}
            disabled={!store?.hasChanged}
            onClick={() => updateInstance.mutate(store.instance)}
          >Save Changes</button>
        </InstanceContext.Provider>
      }
    </div>
  )
}





