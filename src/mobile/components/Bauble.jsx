import { useState } from "react"
import { ActivityInstanceController } from "../../components/activity/ActivityInstanceController"
import { DotSvg } from "../../svg/DotSvg"
import { useActivity } from "../../hooks/queries/activity/useActivity"
import { useFacetStrings } from "../../hooks/queries/facet/useFacetStrings"


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

const BaubleOpen = ({ template, Context, handleSaveChanges, closeBauble }) => {
  

  return (
    <div>

    </div>
  )
}

const BaubleClosed = ({ instanceId, openBauble }) => {
  const [instanceQ, templateQ] = useActivity(instanceId)
  const facetStrings = useFacetStrings(instanceQ.data?.facets ?? {})


  return (
    <div 
      className="bg-neutral-300 rounded-xl
        flex w-max min-w-[8rem] p-2 space-x-2"
      >
      <span className="grow">{templateQ.data?.name}</span>
      <span className="text-xs self-center lowercase">{facetStrings}</span>
      <DotSvg className="w-3 h-3 text-blue-400" />
    </div>
  )
}
