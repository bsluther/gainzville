import { useContext } from "react"
import { ActivityTemplateContext } from "../../state/activityTemplateReducer"
import * as ActivityTemplate from "../../data/ActivityTemplate"

export const ActivityTemplatePresenter = ({ handleSave }) => {
  const [store, dispatch] = useContext(ActivityTemplateContext)

  return (
    <div
      className="
        flex flex-col items-end
        bg-neutral-550
        border-2 border-neutral-800 rounded-md
        p-2 space-y-2
      "
    >
      <div
        className="flex space-x-2"
      >
        <span>Activity Name</span>
        <input
          className="
            bg-neutral-400
            border border-neutral-800 rounded-sm outline-none
            px-1
          "
          value={ActivityTemplate.name(store.template)}
          onChange={e =>
            dispatch({
              type: "input",
              payload: {
                address: ["name"],
                value: e.target.value
              }
            })}
        />
      </div>
      <button
        className="w-max bg-neutral-800 rounded-md px-2 text-neutral-400"
        onClick={() => handleSave(store.template)}
      >Save</button>
    </div>
  )
}