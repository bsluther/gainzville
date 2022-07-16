import { useContext } from "react"
import regex from "../../utility/regex"
import { chWidth } from "../../utility/fns"
import { InstanceContext } from "../../state/activityInstanceReducer"
import { toString, fromString } from "../../data/typeInstance/FloatInstance"
import { getField } from "../../data/ActivityInstance"



function FloatInstance({ address }) {
  const [store, dispatch] = useContext(InstanceContext)

  const value = toString(getField(address)(store))

  const onChange = e =>
    regex.float.test(e.target.value)
      ? dispatch({ 
          type: 'input', 
          payload: { 
            address, 
            value: fromString(e.target.value)(value) 
          }
        })
      : null
  
  return (
    <input
      style={{ width: chWidth(value) }}
      className="
        h-7
        border-2 border-neutral-800 rounded-sm
        bg-neutral-400 focus:bg-neutral-400
        text-center outline-none" 
      value={value ?? ""} 
      onChange={onChange} />
  )
}

export { FloatInstance }



