import { useContext } from "react"
import { getField } from "../../data/ActivityInstance"
import { InstanceContext } from "../activity/ActivityInstance"
import { getString, setString } from "../../data/typeInstance/StringInstance"

export const StringInstance = ({ typeTemplate, address }) => {
  const [store, dispatch] = useContext(InstanceContext)
  const instance = getField(address)(store)
  const string = getString(instance) ?? ""

  return (
    <textarea
      className={`
        w-[25ch]
        h-24
        bg-neutral-400
        border-2 border-neutral-800 rounded-sm outline-none
        px-1
      `}
      value={string ?? ""}
      onChange={e => dispatch({
        type: "input",
        payload: {
          address,
          value: setString(e.target.value)(instance)
      }})}
    />
  )
}

