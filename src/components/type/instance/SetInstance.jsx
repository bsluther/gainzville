import { useContext } from "react"
import { toString, fromString } from "../../../data/typeInstance/SetInstance"
import { getElements } from "../../../data/typeTemplate/SetTemplate"

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




export const SetInstance = ({ Context, address, typeTemplate }) => {
  const [store, dispatch] = useContext(Context)
  const typeInstance = Context.getField(address)(store)
  /*
  Interesting revelation in the name "member" below:
  In all the previous TypeInstances, I called this variable the type,
  eg float, powerset, mass, etc
  But here that pattern doesn't fit. It would be
    const set = toString(typeInstance)
  But really it's a member of the set. The set specifies the possible values.
  If the pattern was the same as here, FloatInstance wouldn't be called FloatInstance.
  It would be called InfiniteSetOfAllPossibleStringsInstance.

  What does this reveal? My usage of Set splits the idea of a type in two:
  1. The set of all possible values.
  2. The type of all possible values.
  In a standard type, both of these things are implied.
  Say I'm in some fancy language:
  Either = sum(Left)(Right)
  (1) The set of all possibles values is the set of all possible values of Left + the set of all possibles of Right.
  (2) The type of all possible values is... Either. The construction.
  */
  const member = toString(typeInstance)

  return (
    <select
      className="
        bg-neutral-300
        outline-none border-2 border-neutral-800 rounded-sm
      "
      value={member}
      onChange={e => 
        dispatch({ 
          type: "input", 
          payload: {
            address, 
            value: fromString(e.target.value)(member) 
          }
        })}
    >
      {getElements(typeTemplate).map(str =>
        <option key={str}>{str}</option>)}
    </select>
  )
}