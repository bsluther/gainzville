import { useState } from "react"
import { XCircleSVG } from "../../svg/XCircleSVG"
import { ActivityInstanceListbox } from "./ActivityInstanceListbox"
import { useUserActivityInstances } from "../../hooks/activity/useUserActivityInstances"
import { ActivityTemplateSearch } from "./ActivityTemplateSearch"
import { useInsertActivityInstance } from "../../hooks/activity/useInsertActivityInstance"
import { useDeleteActivityInstance } from "../../hooks/activity/useDeleteActivityInstance"
import { ActivityInstanceController, NewActivityInstanceController } from "./ActivityInstanceController"



export const ActivityInstanceBrowser = ({ user }) => {
  const instancesQ = useUserActivityInstances(user)
  const [selectedInstance, setSelectedInstance] = useState(null)
  const [newInstanceTemplate, setNewInstanceTemplate] = useState(null)

  const insertInstanceM = useInsertActivityInstance()
  const deleteInstanceM = useDeleteActivityInstance()

  const DeleteButton = ({ instanceId, ...props }) => {
    return <XCircleSVG
      {...props}
      onClick={() => {
        setSelectedInstance(null)
        deleteInstanceM.mutate(instanceId)
      }}
    />
  }

  const handleSaveNewInstance = instance => {
    console.log("saving new instance: ", instance)
    setNewInstanceTemplate(null)
    setSelectedInstance(null)
    insertInstanceM.mutate(instance)
  }

  return (
    <section className="flex flex-col space-y-2">
     <div className="w-max flex flex-col space-y-2">
       <ActivityInstanceListbox 
          instanceIds={instancesQ.isSuccess 
            ? instancesQ.data.map(inst => inst.id) 
            : []} 
          selected={selectedInstance} 
          setSelected={id => setSelectedInstance(id)}
          ItemButtons={DeleteButton}
        />
      
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
            (newInstanceTemplate  
              ? <NewActivityInstanceController 
                  templateId={newInstanceTemplate} 
                  user="dev2" 
                  handleSaveNewInstance={handleSaveNewInstance}
                />
              : <ActivityTemplateSearch 
                  title="New activty:" 
                  handleSelect={id => setNewInstanceTemplate(id)} 
                />)
         }
       </div>
       
     </div>
      {selectedInstance && selectedInstance !== "new" && 
        <ActivityInstanceController instanceId={selectedInstance} />
      }
    </section>
  )
}