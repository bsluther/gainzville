import { useContext } from "react"
import { useUserTypeTemplates } from "../../hooks/type/useUserTypeTemplates"
import { FacetTemplateContext } from "../../state/facetTemplateReducer"
import { XCircleSVG } from "../../svg/XCircleSVG"
import { TypeInstanceDemo } from "../type/TypeInstance"

const FieldIcon = ({ name }) => {

  return (
    <div>
      <span
        className="
          capitalize 
          bg-neutral-700 text-neutral-400
          px-2
        "
      >{name}</span>
    </div>
  )
}

const AddFieldIcon = () => {

  return (
    <XCircleSVG
      className="w-6 h-6 rotate-45"
    />
  )
}

export const FacetTemplatePresenter = ({ handleSave = x => x }) => {
  const [store, dispatch] = useContext(FacetTemplateContext)
  const typeTemplatesQ = useUserTypeTemplates("dev2")
  console.log(typeTemplatesQ.data)
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

        <span>Facet Name</span>
        <input
          className="
            bg-neutral-400
            border border-neutral-800 rounded-sm outline-none
            px-1
          "
          value={store.template.name}
          onChange={e =>
            dispatch({
              type: "setName",
              payload: e.target.value
            })}
        />


      </div>

      <div
        className="flex items-center w-full space-x-2"
      >
        <span>Fields</span>
        <div
          className="
            h-max
            border border-neutral-800 rounded-md outline-none
            w-max bg-neutral-400
            flex items-center
            px-2 py-1 space-x-2
          "
        >
          <FieldIcon name="Float" />
          <AddFieldIcon />
        </div>
      </div>

      {/* <div
        className="flex items-center w-full space-x-2"
      >
        <span>Fields</span>
        <div>
          <FieldIcon name="float" />
        </div>
      </div> */}

      <div
        className="flex items-center w-full space-x-2"
      >
        <span>Preview</span>

      </div>

      {/* <div>
        <ul>
          {typeTemplatesQ.data?.map(tmpl =>
            <li key={tmpl.id}>
              <TypeInstanceDemo typeTemplate={tmpl} />
            </li>)}
        </ul>
      </div> */}

      <button
        className="w-max bg-neutral-800 rounded-md px-2 text-neutral-400"
        onClick={() => handleSave(store.template)}
      >Save</button>
    </div>
  )
}