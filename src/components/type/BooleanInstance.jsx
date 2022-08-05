import { useContext } from "react"
import { getBoolean, setBoolean } from "../../data/typeInstance/BooleanInstance"

export const BooleanInstance = ({ Context, typeTemplate, address }) => {
  const [store, dispatch] = useContext(Context)
  const typeInstance = Context.getField(address)(store)
  // const typeInstance = getField(address)(store)

  const boolean = typeInstance ? getBoolean(typeInstance) : false

  return (
    <input
      className="text-neutral-800"
      type="checkbox" 
      checked={boolean}
      onChange={() => dispatch({
        type: "input",
        payload: {
          address,
          value: setBoolean(!boolean)(typeInstance)
        }
      })} 
    />
  )
}