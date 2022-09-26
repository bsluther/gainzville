import { useAuth0 } from "@auth0/auth0-react"
import { addIndex, map } from "ramda"
import { useState } from "react"
import { createPortal } from "react-dom"
import { FacetEditor } from "../../components/facet/FacetEditor"
import { TypeInstanceDemo } from "../../components/type/instance/TypeInstance"
import { Renamable } from "../../components/util/Renamable"
import { useFacetTemplateController } from "../../hooks/controllers/useFacetTemplateController"
import { useTypeTemplates } from "../../hooks/queries/type/useTypeTemplates"
import { PlusSvg } from "../../svg/PlusSvg"
import { XCircleSvg } from "../../svg/XCircleSvg"
import { snakeToSpace } from "../../utility/fns"

const FLOAT_TEMPLATE_ID = "typ-t-p-float"
const SET_DEMO_ID = "typ-t-66071f81-c660-4b97-96ff-9707d2643251"
const POWERSET_DEMO_ID = "typ-t-0f988cfb-a31f-4be0-ba7d-cc46d9ae2c4f"
const SET_CONSTRUCTOR_ID = "typ-c-set"
const POWERSET_CONSTRUCTOR_ID = "typ-c-powerset"

export const FacetTemplateModal = ({ closeModal }) => {
  const appEl = document.getElementById("mobile-app")
  const { store, dispatch, saveChanges } = useFacetTemplateController("DRAFT")
  const [fieldFocus, setFieldFocus] = useState()

  console.log('modal store', store)

  const handleAppendField = () => {
    setFieldFocus(store.template.fields.length)
    dispatch({ type: "appendField", payload: FLOAT_TEMPLATE_ID })
  }

  const handleUpdateField = index => templateId => {
    dispatch({ type: "updateField", payload: { index, templateId }})
  }

  return createPortal(
    <div
      className="fixed w-full h-full flex flex-col pt-12 px-4 pb-4 space-y-2 items-center justify-centerNO backdrop-blur-md"
    >
      <XCircleSvg
        className="w-8 h-8 text-neutral-200 fill-neutral-800 fixed top-3 right-3" 
        onClick={closeModal}
      />

      {/* <FacetEditor templateId="new" /> */}
      <FacetBuilder 
        name={store?.template?.name}
        setName={str => dispatch({ type: "setName", payload: str })}
        handleAppendField={handleAppendField}
        fields={store?.template?.fields}
        fieldFocus={fieldFocus}
      />

      <div className="w-full overflow-scroll no-scrollbar border-2 border-yellow-300 rounded-lg">
        <TypeTemplateSelector 
          selected={store?.template?.fields[fieldFocus]}
          setSelected={handleUpdateField(fieldFocus)}
        />
      </div>
    </div>,
    appEl
  )
}

const FacetBuilder = ({ name = "", setName, fields = [], handleAppendField, fieldFocus }) => {

  return (
    <div className="bg-neutral-300 flex items-center border border-neutral-800 rounded-lg px-2 py-1 space-x-2">
      <Renamable name={name} setName={setName} />
      {fields.map((typId, ix) => 
        <FieldWrapper key={`${ix} ${typId}`} isFocused={fieldFocus === ix}>
          <TypeInstanceDemo typeTemplateId={typId} />
        </FieldWrapper>)}
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

const FieldWrapper = ({ isFocused, children }) => {
  return (
    <div 
      className={`${isFocused && "border-2 border-yellow-300 rounded-sm"} select-none`}
    >
      {children}
    </div>
  )
}

const TypeTemplateSelector = ({ selected, setSelected }) => {
  const { user } = useAuth0()
  const typeTemplatesQ = useTypeTemplates({ user: user?.sub })
  // console.log(selected)
  return (
    <div
      className="bg-neutral-300 flex flex-col"
    >
      <div 
        className="p-2 flex items-centers border-b border-neutral-800"
        // onClick={e => {
        //   e.stopPropagation()
        //   closeDialog()
        //   setEditingType(SET_CONSTRUCTOR_ID)
        // }}
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
        // onClick={e => {
        //   e.stopPropagation()
        //   closeDialog()
        //   setEditingType(POWERSET_CONSTRUCTOR_ID)
        // }}
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
                  ${selected === tmpl.id && "bg-yellow-300"}`}
                onClick={() => setSelected(tmpl.id)}
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
}