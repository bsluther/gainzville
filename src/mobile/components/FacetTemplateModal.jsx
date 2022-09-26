import { useAuth0 } from "@auth0/auth0-react"
import { append, ascend, equals, findIndex, ifElse, map, pipe, sort, sortWith, when } from "ramda"
import { useRef } from "react"
import { useState } from "react"
import { createPortal } from "react-dom"
import { TypeInstanceDemo } from "../../components/type/instance/TypeInstance"
import { Renamable } from "../../components/util/Renamable"
import { useFacetTemplateController } from "../../hooks/controllers/useFacetTemplateController"
import { useTypeTemplates } from "../../hooks/queries/type/useTypeTemplates"
import { useOutsideClick } from "../../hooks/useOutsideClick"
import { AdjustmentsSvg } from "../../svg/AdjustmentsSvg"
import { PlusSvg } from "../../svg/PlusSvg"
import { SearchSvg } from "../../svg/SearchSvg"
import { XCircleSvg } from "../../svg/XCircleSvg"
import { mapQuery } from "../../utility/fns"

const FLOAT_TEMPLATE_ID = "typ-t-p-float"
const SET_DEMO_ID = "typ-t-66071f81-c660-4b97-96ff-9707d2643251"
const POWERSET_DEMO_ID = "typ-t-0f988cfb-a31f-4be0-ba7d-cc46d9ae2c4f"
const SET_CONSTRUCTOR_ID = "typ-c-set"
const POWERSET_CONSTRUCTOR_ID = "typ-c-powerset"

export const FacetTemplateModal = ({ closeModal }) => {
  const appEl = document.getElementById("mobile-app")
  const { store, dispatch, saveChanges } = useFacetTemplateController("DRAFT")
  const [fieldFocus, setFieldFocus] = useState(null)
  const selectorRef = useRef()

  const handleAppendField = () => {
    setFieldFocus(store.template.fields.length)
    dispatch({ type: "appendField", payload: FLOAT_TEMPLATE_ID })
  }

  const handleUpdateField = index => templateId => {
    dispatch({ type: "updateField", payload: { index, templateId }})
  }

  const handleOutsideClick = () => {
    setFieldFocus(null)
  }

  const handleFieldClick = ix => {
    console.log('ix', ix)
    setFieldFocus(ix)
  }

  return createPortal(
    <div
      className="fixed w-full h-full backdrop-blur-md"
    >
      <XCircleSvg
        className="w-8 h-8 text-neutral-200 fill-neutral-800 fixed top-3 right-3" 
        onClick={closeModal}
      />

      {/* <FacetEditor templateId="new" /> */}
      <div className="w-full h-full flex flex-col pt-12 px-2 pb-4 space-y-8 items-center">
        <FacetBuilder 
          name={store?.template?.name}
          setName={str => dispatch({ type: "setName", payload: str })}
          handleAppendField={handleAppendField}
          handleOutsideClick={handleOutsideClick}
          handleFieldClick={handleFieldClick}
          fields={store?.template?.fields}
          fieldFocus={fieldFocus}
          selectorRef={selectorRef}
        />

        {fieldFocus !== null && 
          <div ref={selectorRef} className="w-full max-h-[50%] bg-neutral-800 rounded-lg flex flex-col space-y-2 p-2">
            <div className="h-full overflow-scroll rounded-lg">
              <TypeTemplateSelector 
                selected={store?.template?.fields[fieldFocus]}
                setSelected={handleUpdateField(fieldFocus)}
              />
            </div>
            <SearchBar />
          </div>}

          <button 
            className="bg-neutral-800 text-neutral-200 border-2 border-neutral-200 font-semibold rounded-lg px-3 py-1"
          >Save "{store?.template?.name}"</button>
      </div>

    </div>,
    appEl
  )
}

const FacetBuilder = ({ name = "", setName, fields = [], fieldFocus, handleAppendField, handleOutsideClick, handleFieldClick, selectorRef }) => {
  const fieldsRef = useRef()
  useOutsideClick([fieldsRef, selectorRef], handleOutsideClick)

  return (
    <div className="bg-neutral-300 flex items-center border border-neutral-800 rounded-lg px-2 py-1 space-x-2">
      <Renamable name={name} setName={setName} />
      <div ref={fieldsRef} className="flex items-center space-x-2">
        {fields.map((typId, ix) => 
          <FieldWrapper 
            key={`${ix} ${typId}`} 
            isFocused={fieldFocus === ix}
            onClick={() => handleFieldClick(ix)}
          >
            <TypeInstanceDemo typeTemplateId={typId} />
          </FieldWrapper>)}
      </div>
      <AppendFieldButton handleAppendField={handleAppendField}  />
    </div>
  )
}

const AppendFieldButton = ({ handleAppendField }) => {
  return (
    <div className="w-max h-max border-2 border-neutral-800 cursor-pointer bg-neutral-800">
      <PlusSvg 
        className="w-5 h-5 text-neutral-200" 
        onClick={handleAppendField}
      />
    </div>
  )
}

const FieldWrapper = ({ isFocused, children, onClick }) => {
  return (
    <div 
      className={`${isFocused && "border-2 border-yellow-300 rounded-sm"} select-none`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

const templateOrder = [
  "typ-t-p-float",
  "typ-t-p-measure-length",
  "typ-t-p-measure-duration",
  "typ-c-set",
  "typ-c-powerset",
  "typ-t-p-string"
]

const findPosition = tmpl => {
  const res = findIndex(equals(tmpl.id))
					 						 (templateOrder)
  return res === -1 ? Infinity : res
}

const lookupOrder = el =>
  when(ix => equals(-1)(ix))
      (() => Infinity)
      (findIndex(equals(el.key))
           (templateOrder))

const TypeTemplateSelector = ({ selected, setSelected }) => {
  const { user } = useAuth0()
  const typeTemplatesQ = useTypeTemplates({ user: user?.sub })
  console.log(typeTemplatesQ)
  // const sortedTemplatesQ = mapQuery(sortWith([
  //  ascend(findPosition)
  // ]))(typeTemplatesQ)

  const templateEls = pipe(
    map(tmpl => 
      <TypeTemplateLi 
        key={tmpl.id} 
        template={tmpl} 
        selected={selected}
        setSelected={setSelected} 
      />),
    append(<TypeConstructorLi key="typ-c-set" demoId={SET_DEMO_ID} />),
    append(<TypeConstructorLi key="typ-c-powerset" demoId={POWERSET_DEMO_ID} />),
    sort(ascend(lookupOrder))
  )(typeTemplatesQ.data ?? [])

  console.log(templateEls)

  return (
    <div
      className="bg-neutral-400 flex flex-col"
    >
      {typeTemplatesQ.isSuccess &&
        templateEls}
    </div>
  )
}

const SearchBar = () => {

  return (
    <div className="w-full rounded-full border-2 border-neutral-300 flex items-center px-1">
      <SearchSvg className="w-5 h-5 text-neutral-300" />
      <input className="bg-neutral-800 text-neutral-300 w-full h-8 outline-none px-2" />
      <AdjustmentsSvg className="w-6 h-6 text-neutral-300 rotate-90" />
    </div>
  )
}

const TypeConstructorLi = ({ demoId }) => {
  return (
    <div 
      className="p-2 flex items-centers border-b border-neutral-800"
    >
      <span className="capitalize w-24 font-semibold">
        + new Set
      </span>
      <div className="text-xs flex items-center">
        <TypeInstanceDemo typeTemplateId={demoId} />
      </div>
    </div>
  )
}

const TypeTemplateLi = ({ template, selected, setSelected }) => 
  <div
    key={template.id}
    className={`p-2 flex items-center border-b border-neutral-800
      ${selected === template.id && "bg-yellow-300"}`}
    onClick={() => setSelected(template.id)}
  >
    <span className="capitalize font-semibold w-24">
      {pipe(when(equals("string"))
                (() => "text"),
            when(equals("float"))
                (() => "number"),
            when(equals("boolean"))
                (() => "true / false"))
          (template.name)}
      </span>
    <div className="text-xs flex items-center">
      <TypeInstanceDemo typeTemplateId={template.id} />
    </div>
  </div>