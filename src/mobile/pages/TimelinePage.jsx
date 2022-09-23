import { useAuth0 } from "@auth0/auth0-react"
import { add, findIndex, insert, pipe, prop, sort } from "ramda"
import { DateTime, Duration } from 'luxon'
import { useActivityInstances } from "../../hooks/queries/activity/instance/useActivityInstances"
import { InstanceBlob, InstanceBlobEditor } from "../components/InstanceBlob"
import { RecordBar } from "../components/RecordBar"
import { GvSpinner } from "../../svg/GvSpinner"
import { useState } from "react"
import { Bauble } from "../components/Bauble"
import { useFacetTemplates } from "../../hooks/queries/facet/useFacetTemplates"
import { useInsertEntity } from "../../hooks/queries/entity/useInsertEntity"
import { Modal } from "../components/Modal"

export const TimelinePage = () => {
  const { user, isAuthenticated } = useAuth0()
  const instancesQ = useActivityInstances(
    { actor: user?.sub }, 
    { enabled: isAuthenticated && !!user.sub }
  )
  const insertM = useInsertEntity()
  const [creatingInstance, setCreatingInstance] = useState(false)
  const prefetchedFacetsQ = useFacetTemplates()
  // this approach is suboptimal: component will re-render unnecessarily on changes to FacetTemplates

  const [creatingTemplate, setCreatingTemplate] = useState(false)

  return (
    <div className="w-full h-full flex flex-col items-center z-0">
      <div className="w-11/12 py-8">
        <RecordBar 
          handleStartCreatingInstance={templateId => setCreatingInstance(templateId)}
          handleStartCreatingTemplate={() => setCreatingTemplate(true)}
        />
      </div>
      <div className="w-11/12 overflow-y-scroll space-y-2 z-0">
        {creatingInstance && 
          <Bauble
            isOpen={true}
            instanceId="new"
            templateId={creatingInstance}
            handleSaveNewInstance={instance => {
              insertM.mutate(instance)
              setCreatingInstance(false)
            }}
            insertMutation={insertM}
          />}
        <Timeline instances={instancesQ.data ?? []} />
      </div>

      {creatingTemplate &&
        <Modal>
          <span>Line 1</span>
          <span>This is Line 2</span>
        </Modal>}
    </div>
  )
}

export const getCreatedAt = prop('createdAt')

const before = accessor => (fst, snd) => {
  const fstDt =  DateTime.fromISO(accessor(fst)) 
  const sndDt = DateTime.fromISO(accessor(snd))

  return fstDt < sndDt
    ? -1
    : fstDt > sndDt
      ? 1
      : 0
}

export const after = accessor => (fst, snd) => {
  const fstDt =  DateTime.fromISO(accessor(fst)) 
  const sndDt = DateTime.fromISO(accessor(snd))

  return fstDt < sndDt
    ? 1
    : fstDt > sndDt
      ? -1
      : 0 
}

const insertMarker = duration => marker => instances => 
  insert(findIndex(inst => {
              if (typeof inst === "string") return false
              const timeSince = DateTime.fromISO(inst.createdAt).diffNow() 
              return -timeSince > duration
            })
                      (instances))
        (marker)
        (instances)


const Timeline = ({ instances = [] }) => {
  const sortedInstances = sort(after(getCreatedAt))(instances)
  const withMarkers = pipe(
    insertMarker(Duration.fromObject({ day: 1 }))
                ("yesterday"),
    insertMarker(Duration.fromObject({ day: 2 }))
                ("two days ago"),
    insertMarker(Duration.fromObject({ day: 7 }))
                ("a week ago"),
    insertMarker(Duration.fromObject({ month: 1 }))
                ("a month ago")
  )(sortedInstances)

  return (
    <ol className="w-full h-full flex flex-col space-y-2">
      {withMarkers.map(el =>
        typeof el === "string"
          ? <div key={el} className="flex w-full items-center space-x-1 text-black">
              <svg className="grow fill-neutral-800" viewBox="0 0 24 2">
                <line x1="0" y1="1" x2="24" y2="1" stroke="currentColor" strokeWidth=".05" />
              </svg>
              <span className="text-xs w-max whitespace-nowrap">
                {el}
              </span>
            </div>
          // : <></>)}
          : <Bauble
              key={el.id} 
              instanceId={el.id}
              isOpen={false}
            />)}

    </ol>
  )
}

