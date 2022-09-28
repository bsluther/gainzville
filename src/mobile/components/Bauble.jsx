import { useState } from "react"
import { ActivityInstanceController, NewActivityInstanceController } from "../../components/activity/ActivityInstanceController"
import { DotSvg } from "../../svg/DotSvg"
import { useActivity } from "../../hooks/queries/activity/useActivity"
import { useFacetStrings } from "../../hooks/queries/facet/useFacetStrings"
import { useContext } from "react"
import { FacetInstance } from "../../components/facet/FacetInstance"
import { PlusSvg } from "../../svg/PlusSvg"
import { FacetBar } from "./FacetBar"
import { GvSpinner } from "../../svg/GvSpinner"
import { DotsVerticalSvg } from "../../svg/DotsVerticalSvg"
import { useDeleteEntity } from "../../hooks/queries/entity/useDeleteEntity"
import { useCallback } from "react"
import { ExpandedInstance } from "../../components/facet/ExpandedInstance"
import { useOutsideClick } from "../../hooks/useOutsideClick"
import { useRef } from "react"
import { FacetTemplateModal } from "./FacetTemplateModal"


export const Bauble = ({ 
  instanceId, 
  templateId, 
  isOpen: initiallyOpen = false, 
  handleSaveNewInstance, 
  insertMutation,
  handleCreateFacet
}) => {
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
      // handleCreateFacet={handleCreateFacet}
    />
  )
  return <BaubleClosed instanceId={instanceId} openBauble={() => setIsOpen(true)} />
}

const BaubleOpen = ({ Context, template, handleSaveChanges, closeBauble, updateMutation, insertMutation }) => {
  const [store, dispatch] = useContext(Context)
  const [addingFacet, setAddingFacet] = useState(false)
  const [editingFacets, setEditingFacets] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const deleteM = useDeleteEntity()
  const baubleRef = useRef()

  const [creatingFacet, setCreatingFacet] = useState(false)
  const handleCreateFacet = () => setCreatingFacet(true)

  const handleDelete = useCallback(
    () => deleteM.mutate(store.instance.id),
    [store.instance.id]
  )

  const handleEditFacets = () => {
    setEditingFacets(true)
    setMenuOpen(false)
  }

  useOutsideClick([baubleRef], () => setEditingFacets(false))

  return (
    <div className="bg-neutral-400 rounded-xl w-full flex flex-col" ref={baubleRef}>
      <div className="relative flex pl-2 py-2 bg-neutral-300 rounded-t-xl border-b border-neutral-800">
        <div className="grow" onClick={closeBauble}>
          <span className="whitespace-nowrap">{template.name}</span>
        </div>
        <DotsVerticalSvg className="ml-4 w-6 h-6 text-blue-400" strokeWidth="3" onClick={() => setMenuOpen(prev => !prev)} />
        {menuOpen && 
          <Menu 
            handleDelete={handleDelete} 
            isUnpersisted={store.isUnpersisted}
            handleEditFacets={handleEditFacets} 
          />}
      </div>

      <div className="min-h-[3rem] text-sm p-2 space-y-2 no-scrollbar overflow-x-scroll rounded-b-xl">
        {Object.keys(store.instance.facets).map(fctId =>
          editingFacets
            ? <ExpandedInstance
                FacetInstance={FacetInstance}
                Context={Context}
                facetTemplateId={fctId} 
                key={fctId}   
                address={{ facet: fctId }}
                facetBgColor='bg-neutral-300'
                // textColor="text-neutral-200"
                fieldBgColor="bg-neutral-200"
                // hideOptions
                facetBorder="border"
                fieldBorder="border"
               />
            : <FacetInstance
                Context={Context} 
                facetTemplateId={fctId} 
                key={fctId} 
                address={{ facet: fctId }}
                facetBgColor='bg-neutral-300'
                // textColor="text-neutral-200"
                fieldBgColor="bg-neutral-200"
                // hideOptions
                facetBorder="border"
                fieldBorder="border"
              />
        )}

        <div 
          className="grow flex justify-end items-end space-x-2" 
          onClick={() => setEditingFacets(false)}
        >
          {addingFacet 
            ? <FacetBar 
                handleSelect={(facetTemplate, typeTemplates) => {
                  setAddingFacet(false)
                  dispatch({ type: "addFacet", payload: { facetTemplate, typeTemplates } })
                }}
                handleOutsideClick={() => setAddingFacet(false)}
                handleCreateFacet={handleCreateFacet}
              />
            : <div className="border border-black rounded-md w-max h-max p-0.5">
                <PlusSvg className="w-6 h-6 text-neutral-800" onClick={() => setAddingFacet(true)} />
              </div>}

          <div className="grow" />

          {(store.isUnpersisted || store.hasChanged || updateMutation?.isLoading || insertMutation?.isLoading) && 
            <Button
              onClick={() => handleSaveChanges(store.instance)}
            >
              {updateMutation?.isLoading || insertMutation?.isLoading
                ? <GvSpinner className="w-6 h-6 fill-yellow-300" />
                : "Save"}
            </Button>}

        </div>

      </div>

      {creatingFacet &&
        <FacetTemplateModal
          templateId="DRAFT"
          closeModal={(facetTemplate, typeTemplates) => {
            setCreatingFacet(false)
            dispatch({ type: "addFacet", payload: { facetTemplate, typeTemplates } })
          }}
        />}
      
    </div>
  )
}

const BaubleClosed = ({ instanceId, openBauble }) => {
  const [instanceQ, templateQ] = useActivity(instanceId)
  const facetStrings = useFacetStrings(instanceQ.data?.facets ?? {})


  return (
    <div 
      className="bg-neutral-300 rounded-xl
        flex w-max max-w-full min-w-[8rem] p-2 space-x-2"
      onClick={openBauble}
    >
      <span className="whitespace-nowrap">{templateQ.data?.name}</span>
      <span className="grow whitespace-nowrap text-xs self-center lowercase overflow-x-scroll no-scrollbar">{facetStrings}</span>
      <div>
        <DotSvg className="w-3 h-3 text-blue-400" />
      </div>
    </div>
  )
}

const Button = props => <button className={`px-2 py-1 text-neutral-300 bg-neutral-800 rounded-md ${props.className}`} {...props}>{props.children}</button>

const Menu = ({ handleDelete, isUnpersisted, handleEditFacets }) => {

  return (
    <div
      className="absolute right-0 top-full -translate-y-1 z-40
      bg-neutral-800 text-neutral-200 rounded-sm border border-neutral-300
        flex flex-col items-end p-2 space-y-2"
    >
      {!isUnpersisted && <span className="cursor-pointer" onClick={handleDelete}>Delete Record</span>}
      <span className="cursor-pointer" onClick={handleEditFacets}>Edit Facets</span>
      <span className="cursor-pointer">Set as Default</span>
      <span className="cursor-pointer">Show Hidden Facets</span>
    </div>
  )
}