import { intersperse, map, pipe } from "ramda"
import { forwardRef } from "react"
import { useState, useRef, useContext } from "react"
import { useTypeTemplates } from "../../hooks/queries/type/useTypeTemplates"
import { useOutsideClick } from "../../hooks/useOutsideClick"
import { PlusSvg } from "../../svg/PlusSvg"
import { XCircleSvg } from "../../svg/XCircleSvg"
import { chWidth, snakeToSpace } from "../../utility/fns"
import { TypeInstanceDemo } from "../type/TypeInstance"
import { WithTooltip } from "../WithTooltip"
import { FacetTemplateController } from "./FacetTemplateController"

const FLOAT_TEMPLATE_ID = "typ-t-p-float"

export const FacetEditor = ({ templateId }) => {

  return (
    <FacetTemplateController
      templateId={templateId}
      Presenter={FacetEditorPresenter}
    />
  )
}

export const FacetEditorPresenter = ({ Context }) => {
  const [store, dispatch] = useContext(Context)
  const [editing, setEditing] = useState()

  const template = store?.template ?? {}
  const fieldCount = template.fields.length

  console.log("edit", editing)

  return (
    <div>
        <div
          className={`
          flex items-center space-x-2
          border-2 border-neutral-800 rounded-lg
          bg-neutral-400
          pl-2 pr-2 py-1
          w-max
          cursor-default
        `}
        >
          <Renamable
            name={template.name}
            setName={str => dispatch({ type: "setName", payload: str })}
          />

          <div className="flex space-x-2 items-center">
            {template.fields?.map((id, ix) =>
              <Field 
                key={`${ix} | ${id}`} 
                isEditing={editing === ix}
                setEditing={() => setEditing(ix)}
                typeTemplate={id}
                setFieldType={id =>
                  dispatch({
                    type: "updateField",
                    payload: {
                      index: ix,
                      templateId: id
                    }
                  })}
                stopEditing={() => setEditing(null)}
                index={ix}
                dispatch={dispatch}
              >
                <TypeInstanceDemo typeTemplateId={id} />
              </Field>)}
          </div>

          <WithTooltip tip="Add field">
            <div className="w-max h-max border-2 border-neutral-800 cursor-pointer bg-neutral-800">
              <PlusSvg 
                className="w-5 h-5 text-neutral-200" 
                onClick={() => {
                  dispatch({
                    type: "appendField",
                    payload: FLOAT_TEMPLATE_ID
                  })
                  setEditing(fieldCount)
                }} 
              />
            </div>
          </WithTooltip>
        </div>
      </div>
  )
}

const Field = ({ setEditing, isEditing, children, typeTemplate, setFieldType, stopEditing, dispatch, index }) => {
  const dialogRef = useRef()
  const buttonRef = useRef()

  useOutsideClick([dialogRef, buttonRef], stopEditing)

  return (
    <div 
      className={`relative w-max h-max cursor-pointer flex
        ${isEditing && "border-2 border-yellow-300"}`}
      onClick={() => {
        setEditing()
      }}
    >
      {children}
      {isEditing &&
        <WithTooltip tip="Remove field">
          <XCircleSvg 
            className="w-5 h-5 absolute right-0 translate-x-1/2 top-0 -translate-y-1/2 fill-neutral-100 cursor-pointer"
            onClick={e => {
              e.stopPropagation()
              dispatch({ type: "removeField", payload: { index }})
              stopEditing()
            }}
            ref={buttonRef}
          />
        </WithTooltip>}
      {isEditing && 
        <FieldDialog
          ref={dialogRef}
          currentType={typeTemplate} 
          setFieldType={setFieldType} 
          stopEditing={stopEditing} 
        />}
    </div>
  )
}

const FieldDialog = forwardRef(({ currentType, setFieldType, stopEditing }, ref) => {
  const typeTemplatesQ = useTypeTemplates()

  return (
    <div
      className="absolute top-full -translate-x-3 translate-y-3 
        bg-neutral-300 rounded-sm border-2 border-yellow-200
        flex flex-col z-50"
      ref={ref}
    >
      {typeTemplatesQ.isSuccess &&
        map(tmpl => 
              <div
                key={tmpl.id}
                className={`p-2 flex items-center border-b border-neutral-800
                  ${currentType === tmpl.id && "bg-yellow-300"}`}
                onClick={() => setFieldType(tmpl.id)}
              >
                <span className="capitalize w-24">{snakeToSpace(tmpl.name)}</span>
                <div className="text-xs flex items-center">
                  <TypeInstanceDemo typeTemplateId={tmpl.id} />
                </div>
              </div>)
            (typeTemplatesQ.data ?? [])}
    </div>
  )
})


const Renamable = ({ name, setName }) => {
  const [renaming, setRenaming] = useState(true)
  const inputRef = useRef()

  useOutsideClick([inputRef], () => setRenaming(false))

  return (
    <div>
      {renaming
        ? <>
            <input
              autoFocus
              onFocus={e => {
                if (name === "New facet") {
                  e.target.select()
                }}}
              ref={inputRef}
              style={{ width: chWidth(name) }}
              className="text-center outline-none bg-neutral-100"
              value={name} 
              onChange={e => setName(e.target.value)}
            />
        </>
        : <span
            className="cursor-text bg-neutral-400 px-1"
            onClick={() => setRenaming(true)}
          >{name}</span>}
    </div>
  )
}