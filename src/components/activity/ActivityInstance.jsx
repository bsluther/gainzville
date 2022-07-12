import { map } from "ramda"
import { createContext, useContext, useEffect, useReducer } from "react"
import { useActivityInstance } from "../../hooks/useActivityInstance"
import { useActivityTemplate } from "../../hooks/useActivityTemplate"
import { FacetInstance } from "../facet/FacetInstance"
import * as L from "partial.lenses"
import { snakeToSpace } from "../../utility/fns"
import { DateTime } from 'luxon'

const reducer = (state, action) => {
  switch (action.type) {
    case 'initialize':
      return action.payload
    case 'input':
      return setFieldValue(action.payload.address)(action.payload.value)(state)
    default:
      console.log(action)
      return state
  }
}

const setFieldValue = address =>
  L.set(['facets', address.facet, 'fields', address.field])

export const InstanceContext = createContext()

export const useActivityInstanceReducer = initialState => useReducer(reducer, initialState)


export function ActivityInstance({ activityInstanceId }) {
  const instanceQ = useActivityInstance(activityInstanceId)
  const templateQ = useActivityTemplate(instanceQ.data?.template, { enabled: instanceQ.isSuccess })
  const [store, dispatch] = useReducer(reducer, null)

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
        <InstanceContext.Provider value={[store, dispatch]}>
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
        </InstanceContext.Provider>
      }
    </div>
  )
}











const ActivityInstancePresenter = () => {
  const [state, dispatch] = useContext(InstanceContext)

  return (
    <div
      className="
        border-2 border-neutral-800 rounded-md bg-neutral-500
        w-max
        p-2 space-y-2
        flex flex-col
      "
    >
          <span className="grow text-center uppercase">{templateQ.data.name}</span>
          {map(([id, data]) => <FacetInstance key={id} facetTemplateId={id} facetInstance={data} address={{ facet: id }} />)
              (Object.entries(instance?.facets))}
    </div>
  )
}

const ActivityInstanceController = ({ initialState, reportState, children }) => {
  const [store, dispatch] = useActivityInstanceReducer()

  return (
    <InstanceContext.Provider value={[store, dispatch]}>
      {children}
    </InstanceContext.Provider>
  )
}