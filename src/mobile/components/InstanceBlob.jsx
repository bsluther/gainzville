import { identity } from "ramda"
import { useRef } from "react"
import { useContext, useLayoutEffect, useMemo, useState } from "react"
import { ActivityInstanceController } from "../../components/activity/ActivityInstanceController"
import { FacetInstance } from "../../components/facet/FacetInstance"
import { TypeInstanceDemo } from "../../components/type/instance/TypeInstance"
import { facetToString } from "../../data/Facet"
import { typeToString } from "../../data/typeTemplate/TypeTemplate"
import { useActivityInstance } from "../../hooks/queries/activity/instance/useActivityInstance"
import { useActivityTemplate } from "../../hooks/queries/activity/template/useActivityTemplate"
import { useFacetTemplate } from "../../hooks/queries/facet/useFacetTemplate"
import { useTypeTemplate } from "../../hooks/queries/type/useTypeTemplate"
import { useTypeTemplates } from "../../hooks/queries/type/useTypeTemplates"
import { getInstance } from "../../state/activityInstanceReducer"
import { DotsVerticalSvg } from "../../svg/DotsVerticalSvg"
import { GvSpinner } from "../../svg/GvSpinner"


const aToG = /[A-G]/i
const hToR = /[H-R]/i
const sToZ = /[S-Z]/i

const colors = {
  ag: '#a82920',
  hr: '#3ca025',
  sz: '#433fc4',
  fallback: '#d8d146f4'
}

const calcColor = letter => {
  if (aToG.test(letter)) {
    return colors['ag']
  } else if (hToR.test(letter)) {
    return colors['hr']
  } else if (sToZ.test(letter)) {
    return colors['sz']
  }
}



export const InstanceBlob = ({ instanceId }) => {
  const instanceQ = useActivityInstance(instanceId)
  const templateQ = useActivityTemplate(instanceQ.data?.template, { enabled: instanceQ.isSuccess })
  const [isEditing, setIsEditing] = useState(false)
  const [renderWithMenuOpen, setRenderWithMenuOpen] = useState(false)

  const instance = instanceQ.data ?? {}
  const template = templateQ.data ?? {}

  if (!templateQ.isSuccess) return <GvSpinner className="w-6 h-6 fill-yellow-300" />

  const color = calcColor(template.name.slice(0, 1))

  if (isEditing) return (
    <ActivityInstanceController 
      Presenter={InstanceBlobEditor}
      instanceId={instance.id}
      endEditing={() => setIsEditing(false)}
      color={color}
      renderWithMenuOpen={renderWithMenuOpen}
    />
  )

  return (
    <div className="flex w-full h-max">
      <div
        className={`h-max overflow-scroll no-scrollbar rounded-l-xl text-sm flex space-x-2 items-center bg-neutral-400`}
      >
        <span className="px-2 py-2 whitespace-nowrap" onClick={() => setIsEditing(true)}>
          {template.name}
        </span>
        {Object.entries(instance.facets)
          .map(([facetId, facetInstance]) => {
            return <FacetValue key={facetId} facetId={facetId} facetInstance={facetInstance} />
          })}
      </div>
      <Tab 
        color={color} 
        handleOpenMenu={() => {
          setRenderWithMenuOpen(true)
          setIsEditing(true)
        }} />
    </div>
  )
}

const Tab = ({ color, handleOpenMenu, renderWithMenuOpen }) => {
  const [menuOpen, setMenuOpen] = useState(renderWithMenuOpen)
  console.log('tab renderwith', renderWithMenuOpen)
  return (
    <div 
      className={`${menuOpen ? "w-max" : "w-6 min-w-[1.5rem] justify-center"} basis-auto rounded-r-xl opacity-70 flex items-center`}
      style={{ backgroundColor: color }}
      onClick={() => {
        setMenuOpen(true)
        handleOpenMenu()
      }}
    >
      {menuOpen &&
        <div className="flex flex-col pl-1">
          <span className="text-neutral-100 text-sm w-max">add facet</span>
        </div>
      }
      <DotsVerticalSvg className="w-5 h-5 text-neutral-300" />
    </div>
  )
}

export const InstanceBlobEditor = ({ Context, template, handleSaveChanges, endEditing, renderWithMenuOpen }) => {
  const [store, dispatch] = useContext(Context)

  const color = calcColor(template.name.slice(0, 1))

  if (!store) return <GvSpinner />
  return (
    <div className="flex w-full h-max">
      <div className={`h-max overflow-scroll no-scrollbar rounded-l-xl text-sm flex space-x-2 items-center bg-neutral-400`}>
        <div className="grow">
          <div 
            className="w-full px-2 pt-2 pb-1 bg-neutral-400"
            onClick={() => endEditing()}
          >
            <span className="text-md">{template.name}</span>
          </div>
          <div className="bg-neutral-400 overflow-x-scroll no-scrollbar text-sm flex flex-col px-2 py-2 space-y-2">
            {Object.keys(store.instance.facets).map(fctId =>
              <FacetInstance 
                key={fctId} 
                Context={Context} 
                facetTemplateId={fctId} 
                address={{ facet: fctId }} 
              />)}
            {store.hasChanged &&
              <button 
                className="bg-neutral-800 text-neutral-200 rounded-md"
                onClick={() => {
                  handleSaveChanges(store.instance)
                  endEditing()
                }}
              >Save Changes</button>}
          </div>
        </div>

    </div>
      <Tab color={color} handleOpenMenu={x => x} renderWithMenuOpen={renderWithMenuOpen} />
    </div>
  )
}

const FacetValue = ({ facetId, facetInstance }) => {
  // note that this component is really just doing a computation that requires fetching - TRY USING A HOOK
  const facetTemplateQ = useFacetTemplate(facetId)
  const typeTemplatesQ = useTypeTemplates(
    { ids: facetTemplateQ.data?.fields }, 
    { enabled: facetTemplateQ.isSuccess }
  )
  const string = useMemo(() => facetToString({
    facetInstance,
    facetTemplate: facetTemplateQ.data,
    typeTemplates: typeTemplatesQ.data
  }), [facetInstance, facetTemplateQ.data, typeTemplatesQ.data])
  
  
  if (!facetTemplateQ.isSuccess) return null
  // if (!facetTemplateQ.isSuccess) return <GvSpinner className="w-6 h-6 fill-yellow-300" />
  
  
  return <span className="lowercase text-xs whitespace-nowrap">{string}</span>
}

