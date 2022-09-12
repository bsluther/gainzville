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



export const InstanceBlob = ({ instanceId, handleSaveChanges }) => {
  const instanceQ = useActivityInstance(instanceId)
  const templateQ = useActivityTemplate(instanceQ.data?.template, { enabled: instanceQ.isSuccess })
  const ref = useRef()
  const [isEditing, setIsEditing] = useState(false)
  
  const instance = instanceQ.data ?? {}
  const template = templateQ.data ?? {}

  if (!templateQ.isSuccess) return <GvSpinner className="w-6 h-6 fill-yellow-300" />

  return (
    <div className="flex w-max h-max" ref={ref}>
      <div
        // style={{ backgroundColor: calcColor(template.name.slice(0, 1)) }}
        className={`w-max h-max px-2 py-2 rounded-l-xl text-sm flex space-x-2 items-center bg-neutral-400`}
        onClick={() => setIsEditing(true)}
      >
        {isEditing
          ? <ActivityInstanceController 
              Presenter={InstanceBlobEditorPresenter}
              instanceId={instance.id}
            />
          : <>
              <span className="px-2">
                {template.name}
              </span>
              {Object.entries(instance.facets)
                .map(([facetId, facetInstance]) => {
                  return <FacetValue key={facetId} facetId={facetId} facetInstance={facetInstance} />
                })}
            </>}


      </div>
      <Tab color={calcColor(template.name.slice(0, 1))} height={ref.current?.clientHeight} />
    </div>
  )
}

const Tab = ({ color, height }) => {
  return (
    <div 
      style={{ backgroundColor: color, height }}
      className="w-6 rounded-r-xl opacity-70"
    ></div>
  )
}

const InstanceBlobEditorController = ({ instanceId }) => {

  return (
    <ActivityInstanceController 
      Presenter={InstanceBlobEditorPresenter}
      instanceId={instanceId}
    />
  )
}

const InstanceBlobEditorPresenter = ({ Context, template, handleSaveChanges }) => {
  const [store, dispatch] = useContext(Context)

  return (
    <div>
      <span>{template.name}</span>
      {Object.keys(store.instance.facets).map(fctId =>
        <FacetInstance 
          key={fctId} 
          Context={Context} 
          facetTemplateId={fctId} 
          address={{ facet: fctId }} 
        />)}
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
  
  
  if (!facetTemplateQ.isSuccess) return <></>
  // if (!facetTemplateQ.isSuccess) return <GvSpinner className="w-6 h-6 fill-yellow-300" />
  
  
  return <span className="lowercase text-xs">{string}</span>
}

