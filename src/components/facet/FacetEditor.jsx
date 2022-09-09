import { useAuth0 } from "@auth0/auth0-react"
import { map } from "ramda"
import { useState, useRef, useContext, forwardRef } from "react"
import { useTypeTemplates } from "../../hooks/queries/type/useTypeTemplates"
import { useOutsideClick } from "../../hooks/useOutsideClick"
import { CheckSvg } from "../../svg/CheckSvg"
import { PlusSvg } from "../../svg/PlusSvg"
import { XCircleSvg } from "../../svg/XCircleSvg"
import { chWidth, snakeToSpace } from "../../utility/fns"
import { TypeInstanceDemo } from "../type/instance/TypeInstance"
import { TypeTemplateController } from "../type/template/TypeTemplateController"
import { WithTooltip } from "../WithTooltip"
import { FacetTemplateController } from "./FacetTemplateController"

const FLOAT_TEMPLATE_ID = "typ-t-p-float"

const SET_DEMO_ID = "typ-t-66071f81-c660-4b97-96ff-9707d2643251"
const POWERSET_DEMO_ID = "typ-t-0f988cfb-a31f-4be0-ba7d-cc46d9ae2c4f"

const SET_CONSTRUCTOR_ID = "typ-c-set"
const POWERSET_CONSTRUCTOR_ID = "typ-c-powerset"


export const FacetEditor = ({ templateId, handleSave, ...props }) => {

  return (
    <FacetTemplateController
      handleSave={handleSave}
      templateId={templateId}
      Presenter={FacetEditorPresenter}
      {...props}
    />
  )
}

export const FacetEditorPresenter = ({ Context, closeEditor, handleSave }) => {
  const [editingField, setEditingField] = useState(false)
  const [fieldFocus, setFieldFocus] = useState()
  const [editingType, setEditingType] = useState()
  const [store, dispatch] = useContext(Context)
  const template = store?.template ?? {}
  const typeTemplatesQ = useTypeTemplates({ ids: template.fields }, { enabled: !!template.fields })

  return (
    <div>
      <div className="relative flex items-center space-x-2">
        <WithTooltip tip="Save facet">
          <div className="px-[2px]! bg-neutral-400 rounded-md border-2 border-neutral-800">
            <CheckSvg 
              className="w-6 h-6 text-neutral-800 cursor-pointer" 
              onClick={() => {
                if (typeTemplatesQ.isSuccess) {
                  handleSave(store.template, typeTemplatesQ.data)
                  setEditingField(false)
                  setFieldFocus(undefined)
                  closeEditor()
                }
              }}
            />
          </div>
        </WithTooltip>
      
        <WithButtons
          Buttons={
            <WithTooltip tip="Discard facet">
              <XCircleSvg 
                className={`w-6 h-6 fill-neutral-200 hover:fill-yellow-300 cursor-pointer focus:bg-green-200
                ${editingField === false || "invisible"}`}
                onClick={() => closeEditor()}
              />
            </WithTooltip>
          }
        >
          <div
            className={`
            flex items-center space-x-2
            border-2 border-neutral-800 rounded-lg
            bg-neutral-400NOT
            bg-yellow-300
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
                  isEditing={editingField && fieldFocus === ix}
                  setEditingField={setEditingField}
                  setFieldFocus={setFieldFocus}
                  typeTemplate={id}
                  setFieldType={id =>
                    dispatch({
                      type: "updateField",
                      payload: {
                        index: ix,
                        templateId: id
                      }
                    })}
                  index={ix}
                  dispatch={dispatch}
                  setEditingType={setEditingType}
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
                    setFieldFocus(template.fields.length)
                    setEditingField(true)
                  }} 
                />
              </div>
            </WithTooltip>
          </div>
          </WithButtons>
        </div>
      
          {editingType && 
            <div className="absolute top-1/4 right-1/2 translate-x-1/2 w-max h-max">
              <WithButtons
                Buttons={
                  <XCircleSvg 
                    className="w-5 h-5 fill-neutral-200 cursor-pointer"
                    onClick={() => setEditingType(null)}
                  />}
              >
                <TypeTemplateController
                  typeTemplateId="new"
                  constructorId={editingType}
                  handleSave={tmpl => {
                    setEditingType(false)
                    dispatch({
                      type: "updateField",
                      payload: {
                        index: fieldFocus,
                        templateId: tmpl.id
                      }
                    })}}
                />
              </WithButtons>
            </div>}
    </div>
  )
}



/**********************************************************/



const WithButtons = ({ children, Buttons }) =>
  <div className="relative w-max h-max">
    {children}
    <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2">
          {Buttons}
    </div>
  </div>


/**********************************************************/


const Field = ({ setEditingField, setFieldFocus, isEditing, children, typeTemplate, setFieldType, dispatch, index, setEditingType }) => {
  const dialogRef = useRef()
  const buttonRef = useRef()

  useOutsideClick([dialogRef, buttonRef], () => setEditingField(false))

  return (
    <div 
      className={`relative w-max h-max cursor-pointer flex
        ${isEditing && "border-2 border-red-400"}`}
      onClick={() => {
        setFieldFocus(index)
        setEditingField(true)
      }}
    >
      {children}
      {isEditing &&
        <WithTooltip tip="Remove field">
          <XCircleSvg 
            className="w-5 h-5 absolute right-0 translate-x-1/2 top-0 -translate-y-1/2 fill-neutral-100 cursor-pointer"
            onClick={e => {
              e.stopPropagation()
              dispatch({ type: "removeField", payload: { index } })
              setEditingField(false)
            }}
            ref={buttonRef}
          />
        </WithTooltip>}
      {isEditing && 
        <TypeSelectorDialog
          ref={dialogRef}
          currentType={typeTemplate} 
          setFieldType={setFieldType} 
          closeDialog={() => setEditingField(false)}
          setEditingType={setEditingType}
        />}
    </div>
  )
}


/**********************************************************/


const TypeSelectorDialog = forwardRef(({ currentType, setFieldType, setEditingType, closeDialog }, ref) => {
  const { user } = useAuth0()
  const typeTemplatesQ = useTypeTemplates({ user: user?.sub })

  return (
    <div
      className="absolute top-full -translate-x-3 translate-y-3 
        bg-neutral-300 rounded-sm border-2 border-yellow-200
        flex flex-col z-50"
      ref={ref}
    >
      <div 
        className="p-2 flex items-centers border-b border-neutral-800"
        onClick={e => {
          e.stopPropagation()
          closeDialog()
          setEditingType(SET_CONSTRUCTOR_ID)
        }}
      >
        <span className="capitalize w-24">
          + new Set
        </span>
        <div className="text-xs flex items-center">
          <TypeInstanceDemo typeTemplateId={SET_DEMO_ID} />
        </div>
      </div>
      <div 
        className="p-2 flex items-centers border-b border-neutral-800"
        onClick={e => {
          e.stopPropagation()
          closeDialog()
          setEditingType(POWERSET_CONSTRUCTOR_ID)
        }}
      >
        <span className="capitalize w-24">
          + new Power Set
        </span>
        <div className="text-xs flex items-center">
          <TypeInstanceDemo typeTemplateId={POWERSET_DEMO_ID} />
        </div>
      </div>
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

      <div
        className="fixed"
      >

      </div>
    </div>
  )
})


/**********************************************************/


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
              className="text-center outline-none bg-neutral-100NOT bg-white"
              value={name} 
              onChange={e => setName(e.target.value)}
            />
        </>
        : <span
            className="cursor-text bg-neutral-400NOT bg-yellow-300 px-1"
            onClick={() => setRenaming(true)}
          >{name}</span>}
    </div>
  )
}