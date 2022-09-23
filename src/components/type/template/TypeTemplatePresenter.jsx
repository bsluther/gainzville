import { useContext } from "react"
import { chWidth } from "../../../utility/fns"
import { XCircleSvg } from "../../../svg/XCircleSvg"
import { TypeInstanceDemo } from "../instance/TypeInstance"

const SET_CONSTRUCTOR_ID = "typ-c-set"
const POWERSET_CONSTRUCTOR_ID = "typ-c-powerset"

export const TypeTemplatePresenter = ({ Context, handleSave }) => {
  const [store, dispatch] = useContext(Context)
  const getField = Context.getField

  return (
    <div className="
      min-w-[22rem] min-h-[10rem]
      flex flex-col items-start space-y-2
      bg-neutral-200 rounded-md p-1
    ">
      <span className="w-full flex justify-center">
        Type Editor
      </span>

      <div className="flex items-center space-x-2">
        <span>Name:</span>
        <input
          style={{ width: chWidth(getField("name")(store), 2) }}
          className="h-7 text-center outline-none rounded-sm bg-neutral-400 text-neutral-800"
          value={getField("name")(store)}
          onChange={e => dispatch({
            type: "setName",
            payload: e.target.value
          })} />
      </div>

      <div className="flex items-center space-x-2">
        <span>Kind:</span>
        <select
          className="h-7 outline-none rounded-sm bg-neutral-400 text-neutral-800 text-center px-1"
          value={getField("typeConstructor")(store)}
          onChange={e => dispatch({
            type: "setConstructor",
            payload: e.target.value
          })}
        >
          <option value={SET_CONSTRUCTOR_ID}>set</option>
          <option value={POWERSET_CONSTRUCTOR_ID}>powerset</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <span>Options:</span>
        <ListEditor
          elements={getField("elements")(store)}
          appendElement={el => dispatch({
            type: "appendElement",
            payload: el
          })}
          updateElement={ix => el => dispatch({
            type: "updateElement",
            payload: {
              index: ix,
              element: el
            }
          })}
          removeElement={ix => dispatch({
            type: "removeElement",
            payload: ix
          })} />
      </div>

      <div className="flex items-center space-x-2">
        <span>Preview:</span>
        <TypeInstanceDemo
          typeTemplate={store.template} />
      </div>

      <div className="w-full flex justify-center">
        <button 
          className="bg-neutral-800 text-neutral-200 rounded-md px-2 py-1"
          onClick={() => handleSave(store.template)}
        >Save</button>
      </div>
    </div>
  )
}
export const ListEditor = ({ elements, updateElement, appendElement, removeElement }) => {
  return (
    <ol className="space-y-1">
      {elements.map((el, ix) => <ListItem
        key={`${el} ${ix}`}
        name={el}
        setName={updateElement(ix)}
        id={ix}
        remove={() => removeElement(ix)} />)}
      <NewItem appendElement={appendElement} />
    </ol>
  )
}
const ListItem = ({ name, setName, remove }) => {
  return (
    <div className="flex items-center">
      <Input
        value={name}
        onChange={e => setName(e.target.value)} />
      <XCircleSvg className="w-5 h-5 cursor-pointer" onClick={remove} />
    </div>
  )
}
const NewItem = ({ appendElement }) => {
  return (
    <Input value="" onChange={e => appendElement(e.target.value)} />
  )
}
const Input = props => <input
  autoFocus
  className="h-7 text-center outline-none rounded-sm bg-neutral-400"
  {...props} />
