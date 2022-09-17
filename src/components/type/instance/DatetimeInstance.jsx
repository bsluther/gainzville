import { useContext } from "react"
import { DateTime } from "luxon"
import { getISO, setISO } from "../../../data/typeInstance/DatetimeInstance"

// opportunity to promap here

export const DatetimeInstance = ({ Context, typeTemplate, fieldBgColor, address, fieldBorder }) => {
  const [store, dispatch] = useContext(Context)
  const instance = Context.getField(address)(store)

  const iso = instance ? getISO(instance) : ""

  if (!iso) { return <span>...</span>}
  
  return (
    <input
      className={`
        ${fieldBgColor ?? "bg-neutral-300"} 
        ${fieldBorder ?? "border-2"} border-neutral-800 rounded-sm outline-none
        px-1`}
      type="datetime-local"
      value={DateTime.fromISO(iso).toISO({ includeOffset: false, suppressSeconds: true, suppressMilliseconds: true }) }
      onChange={e => {
        if (e.target.value) {
          dispatch({
            type: "input",
            payload: {
              address,
              value: setISO(DateTime
                            .fromISO(e.target.value)
                            .toISO({ suppressSeconds: true, suppressMilliseconds: true }))
                           (instance)
            }
          })
        }
      }}
    />
  )
}