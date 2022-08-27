import { find, prop, propEq } from "ramda"
import { useState, useContext, useRef } from "react"
import { useUserTypeTemplates } from "../../hooks/type/useUserTypeTemplates"
import { useOutsideClick } from "../../hooks/useOutsideClick"
import { FacetTemplateContext } from "../../state/facetTemplateReducer"
import { MinusCircleSVG } from "../../svg/MinusCircleSVG"
import { XCircleSvg } from "../../svg/XCircleSvg"
import { TypeInstanceDemo } from "../type/TypeInstance"



const FieldIcon = ({ name, handleRemoveField }) => {
  const [targeted, setTargeted] = useState(false)
  const ref = useRef()
  
  useOutsideClick([ref], () => setTargeted(false))

  return (
    <div
      ref={ref}
      className="relative w-max cursor-pointer"
    >
      <span
        className="
          capitalize 
          bg-neutral-700 text-neutral-400
          px-2
        "
        onClick={() => setTargeted(prev => !prev)}
      >
        {name}
      </span>
        {targeted &&
          <MinusCircleSVG
            fill="rgb(163 163 163 / var(--tw-bg-opacity))"
            className="absolute -top-1 -right-2 w-4 h-4 text-red-600 NOTbg-neutral-400"
            onClick={() => handleRemoveField()}
          />}
    </div>
  )
}

const AddFieldIcon = props => {

  return (
    <XCircleSvg
      {...props}
      className="w-6 h-6 rotate-45 cursor-pointer"
    />
  )
}

export const FacetTemplatePresenter = ({ handleSave = x => x }) => {
  const [store, dispatch] = useContext(FacetTemplateContext)
  const typeTemplatesQ = useUserTypeTemplates("dev2")
  const [addFieldOpen, setAddFieldOpen] = useState(false)
  console.log('store', store)
  return (
    <div
      className="
        flex flex-col items-start
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
          {typeTemplatesQ.isSuccess && 
           store.template.fields.map((typeId, ix) => 
              <FieldIcon
                key={`${typeId}${ix}`}
                name={prop("name")
                          (find(propEq("id")
                                      (typeId))
                               (typeTemplatesQ.data))}
                handleRemoveField={() => {
                  dispatch({
                    type: "removeField",
                    payload: {
                      index: ix
                    }
                  })
                }}

              />)}
          <div
            className="relative"
          >
            <AddFieldIcon
              onClick={() => setAddFieldOpen(prev => !prev)}
            />
            {addFieldOpen &&
              <ul
                className="
                  absolute left-full top-2
                  w-max
                  bg-neutral-400
                  border-2 border-neutral-800
                "
              >
                {typeTemplatesQ.isSuccess &&
                  typeTemplatesQ.data.map(tmpl =>
                    <li
                      key={tmpl.id}
                      className="cursor-pointer"
                      onClick={() => {
                        setAddFieldOpen(false)
                        dispatch({
                          type: "appendField",
                          payload: tmpl.id
                        })
                      }}
                    >{tmpl.name}</li>)}
              </ul>}
          </div>
        </div>
      </div>

      <div
        className="flex items-center w-full space-x-2"
      >
        <span>Preview</span>
        <div 
          className={`
            border-2 border-neutral-800 rounded-lg
            bg-neutral-500
            pl-2 pr-2 py-1 space-x-2
            w-max
            cursor-default
        `}>
          <span>{store.template.name === "" ? "New Facet" : store.template.name}</span>
          {store.template.fields.map((typeId, ix) => 
              <TypeInstanceDemo
                key={`${ix}-${typeId}`} 
                typeTemplateId={typeId} 
                address={{}} 
              />)}
        </div>
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