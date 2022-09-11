import { useAuth0 } from "@auth0/auth0-react"
import { ActivityInstanceController } from "../../components/activity/ActivityInstanceController"

import { useActivityInstances } from "../../hooks/queries/activity/instance/useActivityInstances"
import { InstanceBlob } from "../components/InstanceBlob"
import { NewInstanceBlob } from "../components/NewInstanceBlob"

export const TimelinePage = () => {
  const { user, isAuthenticated } = useAuth0()
  const instancesQ = useActivityInstances(
    { actor: user?.sub }, 
    { enabled: isAuthenticated }
  )



  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-11/12 py-8">
        <NewInstanceBlob />
      </div>
      <div className="w-11/12">
        <Timeline instances={instancesQ.data ?? []} />
      </div>
    </div>
  )
}

const Timeline = ({ instances = [] }) => {

  return (
    <ol className="w-full h-full flex flex-col space-y-1">
      {instances.map(inst =>
        <ActivityInstanceController
          key={inst.id}
          Presenter={InstanceBlob}
          instanceId={inst.id}
        />)}
    </ol>
  )
}