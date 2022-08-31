import { useContext } from "react"
import regex from "../../../utility/regex"
import { chWidth } from "../../../utility/fns"
import { toString, fromString } from "../../../data/typeInstance/FloatInstance"



function FloatInstance({ Context, address }) {
  const [store, dispatch] = useContext(Context)
  const typeInstance = Context.getField(address)(store)

  const float = toString(typeInstance)

  const onChange = e =>
    regex.float.test(e.target.value)
      ? dispatch({ 
          type: 'input', 
          payload: { 
            address, 
            value: fromString(e.target.value)(float) 
          }
        })
      : null
  
  return (
    <input
      style={{ width: chWidth(float) }}
      className="
        h-[1.75em]
        border-2 border-neutral-800 rounded-sm
        bg-neutral-300 focus:bg-neutral-200
        text-center outline-none" 
      value={float ?? ""} 
      onChange={onChange} />
  )
}

export { FloatInstance }


