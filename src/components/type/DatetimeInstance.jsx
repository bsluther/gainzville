import { useContext } from "react"
import { getField } from "../../data/ActivityInstance"
import { InstanceContext } from "../../state/activityInstanceReducer"
import { DateTime } from "luxon"
import { getISO, setISO } from "../../data/typeInstance/DatetimeInstance"


export const DatetimeInstance = ({ typeTemplate, address }) => {
  const [store, dispatch] = useContext(InstanceContext)
  const instance = getField(address)(store)
  const value = instance ? getISO(instance) : ""

  if (!value) { return <span>...</span>}
  
  return (
    <input
      className="
        bg-neutral-400 
        border-2 border-neutral-800 rounded-sm outline-none
        px-1"
      type="datetime-local"
      value={DateTime.fromISO(value).toISO({ includeOffset: false, suppressSeconds: true }) }
      onChange={e => {
        if (e.target.value) {
          dispatch({
            type: "input",
            payload: {
              address,
              value: setISO(DateTime.fromISO(e.target.value).toISO())(instance)
            }
          })
        }
      }}
    />
  )
}