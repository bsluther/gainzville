import { useContext, useLayoutEffect, useMemo, useState } from "react"
import { TypeInstanceDemo } from "../../components/type/instance/TypeInstance"
import { facetToString } from "../../data/Facet"
import { typeToString } from "../../data/typeTemplate/TypeTemplate"
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





export const InstanceBlob = ({ Context, template, handleSaveChanges }) => {
  const [store, dispatch] = useContext(Context)
  const instance = getInstance(store)

  const typeInstances = Object.values(instance.facets).flatMap(fct => fct.fields)


  return (
    <div
      style={{ backgroundColor: calcColor(template.name.slice(0, 1)) }}
      className={`w-max h-max px-2 py-2 rounded-xl text-sm flex space-x-2 items-center`}
      onClick={() => console.log(instance)}
    >
      <span className="px-2">
        {template.name}
      </span>
      {Object
      .entries(instance.facets)
      .map(([facetId, facetInstance]) => {
        return <FacetValue key={facetId} facetId={facetId} facetInstance={facetInstance} />
      })}
      {/* {typeInstances.map(inst => <TypeValue key={inst.id} instance={inst} />)} */}
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
  
  
  if (!facetTemplateQ.isSuccess) return <GvSpinner className="w-6 h-6 fill-yellow-300" />
  
  
  return <span className="lowercase text-xs">{string}</span>
}








const TypeValue = ({ label, templateId, instance }) => {
  const templateQ = useTypeTemplate(instance.template)

  if (!templateQ.isSuccess) return <GvSpinner />
  console.log(typeToString(instance)(templateQ.data))
  return <span>{typeToString(instance)(templateQ.data)}</span>
  return <TypeInstanceDemo typeTemplate={templateQ.data}/>

}