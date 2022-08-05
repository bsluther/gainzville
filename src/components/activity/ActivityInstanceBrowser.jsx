import { useState, useMemo } from "react"
import { ActivityTemplateSearch } from "./ActivityTemplateSearch"
import { useInsertActivityInstance } from "../../hooks/activity/useInsertActivityInstance"
import { useDeleteActivityInstance } from "../../hooks/activity/useDeleteActivityInstance"
import { ActivityInstanceController, NewActivityInstanceController } from "./ActivityInstanceController"
import { EntityListbox } from "../EntityListbox"
import { assoc, find, prop, propEq } from "ramda"
import { TrashSVG } from "../../svg/TrashSVG"
import { useUserActivityInstances } from "../../hooks/activity/useUserActivityInstances"
import { useActivityTemplates } from "../../hooks/activity/useActivityTemplates"


const findTemplate = templateId => templates =>
  find(propEq("id")(templateId))
      (templates)


export const ActivityInstanceBrowser = ({ user }) => {
  const instancesQ = useUserActivityInstances(user)
  const templatesQ = useActivityTemplates()

  const decoratedInstances = useMemo(() =>
    instancesQ.isSuccess && templatesQ.isSuccess
      ? instancesQ.data.map(inst => {
          const template = findTemplate(inst.template)
                                       (templatesQ.data)
          return assoc("name")
                      (prop("name")
                           (template))
                      (inst)
        })
      : [],
    [instancesQ.isSuccess, templatesQ.isSuccess, instancesQ.data, templatesQ.data])

  const [selectedInstance, setSelectedInstance] = useState(null)
  const [newInstanceTemplate, setNewInstanceTemplate] = useState(null)

  const insertInstanceM = useInsertActivityInstance()
  const deleteInstanceM = useDeleteActivityInstance()

  const DeleteIcon = ({ id, className }) => {
    return (
      <TrashSVG
        className={`
          h-5 w-5 hover:text-red-600
          ${className}
        `}
        onClick={() => {
          deleteInstanceM.mutate(id)
        }}
      />
    )
  }

  const handleSaveNewInstance = instance => {
    console.log("saving new instance: ", instance)
    setNewInstanceTemplate(null)
    setSelectedInstance(null)
    insertInstanceM.mutate(instance)
  }

  return (
    <div className="flex flex-col space-y-4">
      <div 
        className="
          flex flex-col items-center
          bg-neutral-550
          border-2 border-neutral-800 rounded-md
          w-max 
          px-1
      ">
        <span>Activity Instances</span>
        <EntityListbox
          entities={decoratedInstances}
          selected={selectedInstance}
          setSelected={setSelectedInstance}
          ItemButtons={DeleteIcon}      
        />

        <div className="flex justify-end">  
          <button
            className="
              h-max
              text-neutral-400 bg-neutral-800 border-2 border-neutral-800 hover:border-neutral-400 rounded-md
              px-1
            "
            onClick={() => setSelectedInstance("new")}
          >
            New
          </button>
        </div>
        
      </div>

      {selectedInstance && selectedInstance !== "new" && 
        <ActivityInstanceController instanceId={selectedInstance} />
      }

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
  )
}