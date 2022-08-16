import { assoc, filter, find, prop, propEq } from "ramda"
import { DateTime } from "luxon"
import { useDeleteActivityInstance } from "../../hooks/queries/activity/instance/useDeleteActivityInstance"
import { useActorActivityInstances } from "../../hooks/queries/activity/instance/useActorActivityInstances"
import { useActivityTemplatesById } from "../../hooks/queries/activity/template/useActivityTemplatesById"
import { EntityListbox } from "../EntityListbox"
import { TrashSVG } from "../../svg/TrashSVG"
import { useState } from "react"
import { useEffect } from "react"
import { useMemo } from "react"


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




export const ActivityInstanceBrowser = ({ selectedInstance, setSelectedInstance }) => {
  const instancesQ = useActorActivityInstances()
  const templateQs = useActivityTemplatesById(
    instancesQ.data?.map(inst => inst.template),
    { enabled: instancesQ.isSuccess }
  )
  const deleteInstanceM = useDeleteActivityInstance()
  const [filters, setFilters] = useState({})

  const templates = successes(templateQs)
  const decoratedInstances = instancesQ.data?.map(inst =>
    pasteName(inst)
             (findTemplate(inst.template)
                          (templates))) ?? []

  const filteredInstances = filter(inst => {
                                    const instanceDT = DateTime.fromISO(inst.createdAt)
                                    const comparatorDT = DateTime.fromISO(filters.date)

                                    return instanceDT.hasSame(comparatorDT, "year")
                                           && instanceDT.hasSame(comparatorDT, "month")
                                           && instanceDT.hasSame(comparatorDT, "day")
                                  })
                                  (decoratedInstances)

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
        <FilterMenu setFilters={setFilters} />
        <EntityListbox
          entities={filteredInstances}
          selected={selectedInstance}
          setSelected={id => setSelectedInstance(id)}
          ItemButtons={DeleteIcon}      
        />

        <div className="flex justify-end">  
          {/* <button
            className="w-max h-max px-2 py-1 bg-neutral-300 text-neutral-800 rounded-md"
            onClick={() => handleEdit(selectedInstance)}
          >
            Edit
          </button> */}
        </div>
        
      </div>


  )
}

export const FilterMenu = ({ setFilters }) => {
  const [date, setDate] = useState(() => DateTime.now().toISODate())
  const filters = useMemo(
    () => ({ date }),
    [date]
  )

  useEffect(() => {
    setFilters(filters)
  }, [setFilters, filters])

  return (
    <div
      className="w-full bg-neutral-700 text-neutral-300 rounded-md px-2 py-1 flex flex-col"
    >
      <div className="flex space-x-4">
        <span>Date</span>
        <input
          className="bg-neutral-700 outline-none" 
          type="date" 
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>
    </div>
  )
}