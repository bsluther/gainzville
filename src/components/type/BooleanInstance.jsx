import { useContext } from "react"
import { InstanceContext } from "../../state/activityInstanceReducer"
import { getField } from "../../data/ActivityInstance"
import { getBoolean, setBoolean } from "../../data/typeInstance/BooleanInstance"

export const BooleanInstance = ({ typeTemplate, address }) => {
  const [store, dispatch] = useContext(InstanceContext)
  const instance = getField(address)(store)
  const boolean = instance ? getBoolean(instance) : false

  return (
    <input
      className="text-neutral-800"
      type="checkbox" 
      checked={boolean}
      onChange={() => dispatch({
        type: "input",
        payload: {
          address,
          value: setBoolean(!boolean)(instance)
        }
      })} 
    />
  )
}