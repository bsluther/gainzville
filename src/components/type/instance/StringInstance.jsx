import { useContext } from "react"
import { getString, setString } from "../../../data/typeInstance/StringInstance"

export const StringInstance = ({ Context, typeTemplate, address, fieldBgColor, fieldBorder }) => {
  const [store, dispatch] = useContext(Context)
  const typeInstance = Context.getField(address)(store)
  const string = getString(typeInstance) ?? ""

  return (
    <textarea
      className={`
        w-[25ch]
        h-24
        ${fieldBgColor ?? "bg-neutral-300"}
        ${fieldBorder ?? "border-2"} border-neutral-800 rounded-sm outline-none
        px-1
      `}
      value={string ?? ""}
      onChange={e => dispatch({
        type: "input",
        payload: {
          address,
          value: setString(e.target.value)(typeInstance)
      }})}
    />
  )
}

