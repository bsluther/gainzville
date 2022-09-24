import { append, remove, update } from "ramda"
import { createPortal } from "react-dom"
import { ListEditor } from "../../components/type/template/TypeTemplatePresenter"
import { useActivityTemplateController } from "../../hooks/controllers/useActivityTemplateController"
import { useInsertEntity } from "../../hooks/queries/entity/useInsertEntity"
import { GvSpinner } from "../../svg/GvSpinner"
import { XCircleSvg } from "../../svg/XCircleSvg"

export const ActivityTemplateModal = ({ closeModal }) => {
  const insertM = useInsertEntity({ onSuccess: closeModal })
  const { store, dispatch, handleSave } = useActivityTemplateController(
    "DRAFT",
    { handleInsert: insertM.mutate}
  )
  const appEl = document.getElementById("mobile-app")

  console.log('store', store)

  return createPortal(
    <div
      className="fixed w-full h-full flex flex-col p-3 space-y-2 items-center justify-center backdrop-blur-md"
    >
      <div className="relative w-full flex flex-col items-center justify-center">
        <XCircleSvg 
          className="w-8 h-8 text-neutral-200 fill-neutral-800 absolute -top-3 -right-3" 
          onClick={closeModal}
        />
        <div className=" text-neutral-300 bg-neutral-800 space-y-4 px-4 py-4 rounded-lg">

          <div className="flex items-center space-x-2">
            <span className="shrink text">Activity Name:</span>
            <input
              autoFocus
              className="h-max w-full bg-neutral-400 rounded-sm grow text-black outline-none px-2" 
              value={store?.template?.name ?? ""}
              type="text"
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
          
          <div className="flex space-x-2 items-center">
            <span>Description:</span>
            <textarea 
              className="bg-neutral-400 rounded-sm grow text-black outline-none h-16 text-sm px-2"
              value={store?.template?.description ?? ""}
              onChange={e => 
                dispatch({
                  type: "input",
                  payload: {
                    address: ["description"],
                    value: e.target.value
                  }
                })}
            />
          </div>
          
          <div className="flex items-center space-x-2 text-neutral-800">
            <span className="text-neutral-300 grow">Aliases:</span>
            <ListEditor
              iconColor="text-neutral-300"
              elements={store?.template?.aliases}
              appendElement={el =>
                dispatch({
                  type: "input",
                  payload: {
                    address: ["aliases"],
                    value: append(el)(store?.template?.aliases)
                  }
                })}
              updateElement={ix => el =>
                dispatch({
                  type: "input",
                  payload: {
                    address: ["aliases"],
                    value: update(ix)(el)(store?.template?.aliases)
                  }
                })}
              removeElement={ix => {
                dispatch({
                  type: "input", 
                  payload: {
                    address: ["aliases"],
                    value: remove(ix)(1)(store?.template?.aliases)
                  }
                })
              }}
            />
          </div>
        

        </div>
        
      </div>

      <button 
        className="bg-neutral-800 text-neutral-300 rounded-md px-4 py-2"
        onClick={() => handleSave(store.template)}
      >
        {insertM.isLoading
          ? <GvSpinner className="w-6 h-6 fill-yellow-300" />
          : "Save"}
      </button>

    </div>,
    appEl
  )
}