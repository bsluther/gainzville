import { useState } from "react"
import { ActivityInstanceController, NewActivityInstanceController } from "../../components/activity/ActivityInstanceController"
import { DotSvg } from "../../svg/DotSvg"
import { useActivity } from "../../hooks/queries/activity/useActivity"
import { useFacetStrings } from "../../hooks/queries/facet/useFacetStrings"
import { useContext } from "react"
import { FacetInstance } from "../../components/facet/FacetInstance"
import { PlusSvg } from "../../svg/PlusSvg"
import { FacetBar } from "./FacetBar"
import { useInsertEntity } from "../../hooks/queries/entity/useInsertEntity"
import { useUpdateActivityInstance } from "../../hooks/queries/activity/instance/useUpdateActivityInstance"
import { GvSpinner } from "../../svg/GvSpinner"
import { TrashSVG } from "../../svg/TrashSVG"
import { DotsVerticalSvg } from "../../svg/DotsVerticalSvg"


export const Bauble = ({ instanceId, templateId, isOpen: initiallyOpen = false, handleSaveNewInstance, insertMutation }) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen)

  if (isOpen && instanceId === "new") return (
    <NewActivityInstanceController
      Presenter={BaubleOpen}
      templateId={templateId}
      handleSaveNewInstance={handleSaveNewInstance}
      insertMutation={insertMutation}
    />
  )
  if (isOpen) return (
    <ActivityInstanceController
      Presenter={BaubleOpen}
      instanceId={instanceId}
      closeBauble={() => setIsOpen(false)}
    />
  )
  return <BaubleClosed instanceId={instanceId} openBauble={() => setIsOpen(true)} />
}

const BaubleOpen = ({ Context, template, handleSaveChanges, closeBauble, updateMutation, insertMutation }) => {
  const [store, dispatch] = useContext(Context)
  const [addingFacet, setAddingFacet] = useState(false)
  // const insertEntityM = useInsertEntity()
  // const updateActInstM = useUpdateActivityInstance()
  // console.log('mutation', updateMutation)

  return (
    <div className="bg-neutral-400 rounded-xl w-full flex flex-col">
      <div 
        className="flex pl-2 py-2 bg-neutral-300 rounded-t-xl border-b border-neutral-800"
        onClick={closeBauble}
      >
        <span className="whitespace-nowrap">{template.name}</span>
        <span className="grow" />
        {/* <DotSvg className="w-3 h-3 text-blue-400" /> */}
        <DotsVerticalSvg className="w-6 h-6 text-blue-400" />
      </div>

      <div className="min-h-[3rem] text-sm p-2 space-y-2 no-scrollbar overflow-x-scroll rounded-b-xl">
        {Object.keys(store.instance.facets).map(fctId => 
          <FacetInstance
            Context={Context} 
            facetTemplateId={fctId} 
            key={fctId} 
            address={{ facet: fctId }}
            facetBgColor='bg-neutral-300'
            // textColor="text-neutral-200"
            fieldBgColor="bg-neutral-200"
            hideOptions
            facetBorder="border"
            fieldBorder="border"
          />)}

        <div className="grow flex justify-end items-end space-x-2">
          {addingFacet 
            ? <FacetBar 
                handleSelect={(facetTemplate, typeTemplates) => {
                  setAddingFacet(false)
                  dispatch({ type: "addFacet", payload: { facetTemplate, typeTemplates } })
                }}
                handleOutsideClick={() => setAddingFacet(false)}
              />
            : <PlusSvg className="w-6 h-6 border border-neutral-800 text-neutral-800 rounded-md" onClick={() => setAddingFacet(true)} />}

          <div className="grow" />

          {(store.isUnpersisted || store.hasChanged || updateMutation?.isLoading || insertMutation?.isLoading) && 
            <Button
              onClick={() => handleSaveChanges(store.instance)}
            >
              {updateMutation?.isLoading || insertMutation?.isLoading
                ? <GvSpinner className="w-6 h-6 fill-yellow-300" />
                // : store.isUnpersisted ? "Save" : "Save Changes"}
                : "Save"}
            </Button>}
          
          {/* <div className="grow" /> */}
            
          <Button>
            <TrashSVG className="w-5 h-5 text-red-500" />
          </Button> 
          {/* <button className="px-2 py-1 text-neutral-300 bg-red-500 rounded-md border-2 border-neutral-800">
            <TrashSVG className="w-5 h-5 text-neutral-800" />
          </button> */}

        </div>

      </div>
      
    </div>
  )
}

const BaubleClosed = ({ instanceId, openBauble }) => {
  const [instanceQ, templateQ] = useActivity(instanceId)
  const facetStrings = useFacetStrings(instanceQ.data?.facets ?? {})


  return (
    <div 
      className="bg-neutral-300 rounded-xl
        flex w-max max-w-full overflow-x-scroll min-w-[8rem] p-2 space-x-2"
      onClick={openBauble}
    >
      <span className="whitespace-nowrap">{templateQ.data?.name}</span>
      <span className="grow whitespace-nowrap text-xs self-center lowercase overflow-scroll no-scrollbar">{facetStrings}</span>
      <div>
        <DotSvg className="w-3 h-3 text-blue-400" />
      </div>
    </div>
  )
}

export const Button = props => <button className={`px-2 py-1 text-neutral-300 bg-neutral-800 rounded-md ${props.className}`} {...props}>{props.children}</button>