import { useContext } from "react"
import { appendElement, isElement, removeElement } from "../../data/typeInstance/PowersetInstance"
import { snakeToSpace } from "../../utility/fns"

export const PowersetInstance = ({ Context, typeTemplate, address }) => {
  const [store, dispatch] = useContext(Context)
  const typeInstance = Context.getField(address)(store)
  // const instance = getField(address)(store)
  const options = typeTemplate.elements

  return (
    <ol
      className="
        w-24
        border-2 border-neutral-800
        bg-neutral-300
      "
    >
      {options.map(str =>
        <li 
          className={`
            capitalize cursor-pointer
            ${isElement(str)(typeInstance) && "bg-yellow-300"}
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
                value: isElement(str)(typeInstance)
                  ? removeElement(str)(typeInstance)
                  : appendElement(str)(typeInstance)
              }
            })
          }}
        >{snakeToSpace(str)}</li>)}
    </ol>
  )
}