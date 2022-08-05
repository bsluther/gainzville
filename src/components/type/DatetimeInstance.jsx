import { useContext } from "react"
import { DateTime } from "luxon"
import { getISO, setISO } from "../../data/typeInstance/DatetimeInstance"

// opportunity to promap here

export const DatetimeInstance = ({ Context, typeTemplate, address }) => {
  const [store, dispatch] = useContext(Context)
  const instance = Context.getField(address)(store)
  // const instance = getField(address)(store)

  const datetime = instance ? getISO(instance) : ""

  if (!datetime) { return <span>...</span>}
  
  return (
    <input
      className="
        bg-neutral-400 
        border-2 border-neutral-800 rounded-sm outline-none
        px-1"
      type="datetime-local"
      value={DateTime.fromISO(datetime).toISO({ includeOffset: false, suppressSeconds: true }) }
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