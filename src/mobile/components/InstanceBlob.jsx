import { identity } from "ramda"
import { useRef } from "react"
import { useContext, useLayoutEffect, useMemo, useState } from "react"
import { ActivityInstanceController } from "../../components/activity/ActivityInstanceController"
import { FacetInstance } from "../../components/facet/FacetInstance"
import { TypeInstanceDemo } from "../../components/type/instance/TypeInstance"
import { WithTooltip } from "../../components/WithTooltip"
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
import { PlusSvg } from "../../svg/PlusSvg"
import { TrashSVG } from "../../svg/TrashSVG"


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
    />
  )

  return (
    <div className="flex w-full h-max">
      <div
        className={`h-max overflow-scroll no-scrollbar rounded-l-xl text-sm flex space-x-2 items-center bg-neutral-400 border-y-2 border-l-2 border-neutral-800`}
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
      />
    </div>
  )
}

const Tab = ({ color }) => {

  return (
    <div 
      className={`w-4 rounded-r-xl opacity-70 flex items-center border-y-2 border-r-2 border-neutral-800`}
      style={{ backgroundColor: color }}
    >
      {/* <DotsVerticalSvg style={{ color }} className="w-5 h-5 text-neutral-300NO brightness-150" /> */}
    </div>
  )
}



export const InstanceBlobEditor = ({ Context, template, handleSaveChanges, endEditing }) => {
  const [store, dispatch] = useContext(Context)
  const [focus, setFocus] = useState("activity")

  const color = calcColor(template.name.slice(0, 1))

  if (!store) return <GvSpinner />
  return (
    <div className="flex w-full h-max">
      <div className={`h-max overflow-scroll no-scrollbar rounded-l-xl text-sm flex space-x-2 pr-2 items-center bg-neutral-400 border-y-2 border-l-2 ${focus === "activity" ? "border-neutral-200" : "border-neutral-800"}`}>
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
                onClick={() => setFocus(fctId)}
                borderColor={focus === fctId ? "border-neutral-200" : null}
              />)}
            {store.hasChanged &&
              <button 
                className="bg-neutral-800 text-neutral-200 rounded-md"
                onClick={() => {
                  handleSaveChanges(store.instance)
                  endEditing()
                }}
              >Save Changes</button>}
            <div className="flex justify-center">
              <PlusSvg className="w-6 h-6" />
              <TrashSVG className="w-6 h-6" />
            </div>
          </div>
        </div>
    </div>
      <EditorTab color={color} border={focus === "activity" ? "border-neutral-200" : "border-neutral-800"} />
    </div>
  )
}

const EditorTab = ({ color, border }) => {

  return (
    <div 
      className={`w-max p-1 rounded-r-xl opacity-70NO flex flex-col items-center justify-center space-y-2 border-y-2 border-r-2 border-opacity-100 ${border}`}
      style={{ backgroundColor: color }}
    >
      <WithTooltip tip="add facet">
        <PlusSvg className="w-6 h-6" />
      </WithTooltip>
      <TrashSVG className="w-6 h-6" />
      {/* <DotsVerticalSvg style={{ color }} className="w-5 h-5 text-neutral-300NO brightness-150" /> */}
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
  // this is a setting where it might be faster/better to useQueries so that each type template is cached and available
  const string = useMemo(() => facetToString({
    facetInstance,
    facetTemplate: facetTemplateQ.data,
    typeTemplates: typeTemplatesQ.data
  }), [facetInstance, facetTemplateQ.data, typeTemplatesQ.data])
  
  
  if (!facetTemplateQ.isSuccess) return null
  // if (!facetTemplateQ.isSuccess) return <GvSpinner className="w-6 h-6 fill-yellow-300" />
  
  
  return <span className="lowercase text-xs whitespace-nowrap">{string}</span>
}

