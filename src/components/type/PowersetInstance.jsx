import { useContext } from "react"
import { InstanceContext } from "../../state/activityInstanceReducer"
import { getField } from "../../data/ActivityInstance"
import { appendElement, isElement, removeElement } from "../../data/typeInstance/PowersetInstance"
import { snakeToSpace } from "../../utility/fns"

export const PowersetInstance = ({ typeTemplate, address }) => {
  const [store, dispatch] = useContext(InstanceContext)
  const instance = getField(address)(store)
  const options = typeTemplate.elements

  return (
    <ol
      className="
        w-24
        border-2 border-neutral-800
        bg-neutral-400
      "
    >
      {options.map(str =>
        <li 
          className={`
            capitalize cursor-pointer
            ${isElement(str)(instance) && "bg-yellow-300"}
            border-b border-neutral-600
            last:border-0
            pl-2
          `}
          key={str}
          onClick={() => {
            dispatch({
              type: "input",
              payload: {
                address,
                value: isElement(str)(instance)
                  ? removeElement(str)(instance)
                  : appendElement(str)(instance)
              }
            })
          }}
        >{snakeToSpace(str)}</li>)}
    </ol>
  )
}