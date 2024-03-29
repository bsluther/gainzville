import { useContext } from "react"
import regex from "../../../utility/regex"
import { chWidth } from "../../../utility/fns"
import { toString, fromString } from "../../../data/typeInstance/FloatInstance"
import { floatInstanceOf } from "../../../data/typeTemplate/FloatTemplate"



function FloatInstance({ Context, address, fieldBgColor, fieldBorder }) {
  const [store, dispatch] = useContext(Context)
  const typeInstance = Context.getField(address)(store)

  const float = toString(typeInstance)

  const onChange = e =>
    regex.float.test(e.target.value)
      ? dispatch({ 
          type: 'input', 
          payload: { 
            address,
            value: floatInstanceOf(e.target.value)
            // value: fromString(e.target.value)(float) 
          }
        })
      : null
  
  return (
    <input
      style={{ width: chWidth(float) }}
      className={`
        h-[1.75em]
        ${fieldBorder ?? "border-2"} border-neutral-800 rounded-sm
        ${fieldBgColor ?? "bg-neutral-300"} focus:bg-neutral-200
        text-center outline-none`}
      value={float ?? ""} 
      onChange={onChange} />
  )
}

export { FloatInstance }



