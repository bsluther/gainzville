import { useState } from "react"
import { ActivityInstance } from "./ActivityInstance"
import { ActivityInstanceListbox } from "./ActivityInstanceListbox"
import { useUserActivityInstances } from "../../hooks/useUserActivityInstances"
import { ActivityTemplateSearch } from "./ActivityTemplateSearch"



export const ActivityInstanceBrowser = ({ user }) => {
  const instancesQ = useUserActivityInstances(user)
  const [selectedInstance, setSelectedInstance] = useState(null)
  const [newInstanceTemplate, setNewInstanceTemplate] = useState(null)

  return (
    <section className="flex flex-col space-y-2">
     <div className="w-max flex flex-col space-y-2">
       <ActivityInstanceListbox 
        instanceIds={instancesQ.isSuccess 
          ? instancesQ.data.map(inst => inst.id) 
          : []} 
        selected={selectedInstance} 
        setSelected={id => setSelectedInstance(id)} />
      
       <div className="flex justify-end">
         {selectedInstance !== "new" &&
            <button
              className="
                h-max
                text-neutral-400 bg-neutral-800 border-2 border-neutral-800 hover:border-neutral-400 rounded-md
                px-1
              "
              onClick={() => setSelectedInstance("new")}
            >
              New
            </button>}
         {selectedInstance === "new" &&
            <ActivityTemplateSearch title="New activty:" handleSelect={id => setNewInstanceTemplate(id)} />
         }
       </div>
       
     </div>
      {selectedInstance && selectedInstance !== "new" && 
        <ActivityInstance activityInstanceId={selectedInstance} />
      }
    </section>
  )
}