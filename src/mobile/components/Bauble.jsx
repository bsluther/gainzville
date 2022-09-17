import { useState } from "react"
import { ActivityInstanceController } from "../../components/activity/ActivityInstanceController"
import { DotSvg } from "../../svg/DotSvg"
import { useActivity } from "../../hooks/queries/activity/useActivity"
import { useFacetStrings } from "../../hooks/queries/facet/useFacetStrings"
import { useContext } from "react"
import { FacetInstance } from "../../components/facet/FacetInstance"


export const Bauble = ({ instanceId, isOpen: initiallyOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen)

  if (isOpen) return (
    <ActivityInstanceController
      Presenter={BaubleOpen}
      instanceId={instanceId}
      closeBauble={() => setIsOpen(false)}
    />
  )
  return <BaubleClosed instanceId={instanceId} openBauble={() => setIsOpen(true)} />
}

const BaubleOpen = ({ Context, template, handleSaveChanges, closeBauble }) => {
  const [store] = useContext(Context)
  console.log(store.instance)
  return (
    <div 
      className="bg-neutral-300 rounded-xl w-full flex flex-col overflow-x-scroll p-2 space-y-2"
      onClick={closeBauble}
    >
      <div className="flex">
        <span className="whitespace-nowrap">{template.name}</span>
        <span className="grow" />
        <DotSvg className="w-3 h-3 text-blue-400" />
      </div>

      <div className="text-sm space-y-1">
        {Object.keys(store.instance.facets).map(fctId => 
          <FacetInstance
            Context={Context} 
            facetTemplateId={fctId} 
            key={fctId} 
            address={{ facet: fctId }}
            facetBgColor='bg-neutral-400'
            // textColor='text-neutral-200'
            fieldBgColor='bg-neutral-300'
          />)}
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
      <span className="grow whitespace-nowrap text-xs self-center lowercase overflow-hidden">{facetStrings}</span>
      <DotSvg className="w-3 h-3 text-blue-400" />
    </div>
  )
}
