import { useContext } from "react"
import { InstanceContext } from "../../state/activityInstanceReducer"
import { getField } from "../../data/ActivityInstance"
import { toString, fromString } from "../../data/typeInstance/SetInstance"
import { getElements } from "../../data/typeTemplate/SetTemplate"

// Let's think hard about what dependencies this component has on other modules. What could change out from under it?


// 1. Address: Provided as a prop by the parent. View layer / state management.
// 2. TypeTemplate: Data structure.
// 3. useContext: React.
// 4. InstanceContext: State management.
// 5. getFieldValue: ActivityInstance data module.
// 6. store, dispatch: State management.

// More implicit dependencies:
// The shape of the TypeInstance, eg [String]
// The shape that must be provided to dispatch, eg String.




export const SetInstance = ({ address, typeTemplate }) => {
  const [store, dispatch] = useContext(InstanceContext)
  const value = toString(getField(address)(store))

  return (
    <select
      className="
        bg-neutral-400
        outline-none border-2 border-neutral-800 rounded-sm
      "
      value={value}
      onChange={e => 
        dispatch({ 
          type: "input", 
          payload: { address, value: fromString(e.target.value)(value) }
        })}
    >
      {getElements(typeTemplate).map(str =>
        <option key={str}>{str}</option>)}
    </select>
  )
}