import { useState } from "react"
import { useDeleteActivityInstance } from "../../hooks/activity/useDeleteActivityInstance"
import { EntityListbox } from "../EntityListbox"
import { assoc, find, prop, propEq } from "ramda"
import { TrashSVG } from "../../svg/TrashSVG"
import { useActorActivityInstances } from "../../hooks/queries/activity/instance/useActorActivityInstances"
import { useActivityTemplatesById } from "../../hooks/queries/activity/template/useActivityTemplatesById"

// CLEAN ME!


const findTemplate = templateId => templates =>
  find(propEq("id")(templateId))
      (templates)

const pasteName = instance => template =>
  assoc("name")
       (prop("name")
            (template))
       (instance)

const successes = queries =>
  queries.reduce((acc, q) =>
    q.isSuccess ? acc.concat(q.data) : acc,
    []
  )


export const ActivityInstanceBrowser = ({ handleEdit }) => {
  const instancesQ = useActorActivityInstances()
  const templateQs = useActivityTemplatesById(
    instancesQ.data?.map(inst => inst.template),
    { enabled: instancesQ.isSuccess }
  )
  const deleteInstanceM = useDeleteActivityInstance()


  const templates = successes(templateQs)
  const decoratedInstances = instancesQ.data?.map(inst =>
    pasteName(inst)
             (findTemplate(inst.template)
                          (templates)))


  const [selectedInstance, setSelectedInstance] = useState(null)

  

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

  return (

      <div 
        className="
          w-full h-full
          flex flex-col items-center
          bg-neutral-800
          px-4 pb-4 space-y-4
      ">
        {/* <span>Date</span> */}
        <EntityListbox
          entities={decoratedInstances}
          selected={selectedInstance}
          setSelected={setSelectedInstance}
          ItemButtons={DeleteIcon}      
        />

        <div className="flex justify-end">  
          <button
            className="w-max h-max px-2 py-1 bg-neutral-300 text-neutral-800 rounded-md"
            onClick={() => handleEdit(selectedInstance)}
          >
            Edit
          </button>
        </div>
        
      </div>


  )
}