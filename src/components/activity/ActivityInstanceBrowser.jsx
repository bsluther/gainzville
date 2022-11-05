import { assoc, filter, find, map, pipe, prop, propEq, propOr, reduce, toPairs } from "ramda"
import { DateTime } from "luxon"
import { useDeleteActivityInstance } from "../../hooks/queries/activity/instance/useDeleteActivityInstance"
import { useActivityTemplatesById } from "../../hooks/queries/activity/template/useActivityTemplatesById"
import { EntityListbox } from "../EntityListbox"
import { TrashSVG } from "../../svg/TrashSVG"
import { useRef, useState } from "react"
import { useEffect } from "react"
import { useMemo } from "react"
import { useActivityInstances } from "../../hooks/queries/activity/instance/useActivityInstances"
import { useAuth0 } from "@auth0/auth0-react"
import { FilterSvg } from "../../svg/FilterSvg"
import { XSvg } from "../../svg/XSvg"
import { XCircleSvg } from "../../svg/XCircleSvg"
import { WithTooltip } from "../WithTooltip"
import { SearchSvg } from "../../svg/SearchSvg"
import { AdjustmentsSvg } from "../../svg/AdjustmentsSvg"
import { PlusSvg } from "../../svg/PlusSvg"
import { useOutsideClick } from "../../hooks/useOutsideClick"


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
  const { user, isAuthenticated } = useAuth0()
  const instancesQ = useActivityInstances(
    { actor: user?.sub },
    { enabled: isAuthenticated}
  )
  const templateQs = useActivityTemplatesById(
    instancesQ.data?.map(inst => inst.template),
    { enabled: instancesQ.isSuccess }
  )
  const deleteInstanceM = useDeleteActivityInstance()

  const templates = successes(templateQs)
  const decoratedInstances = instancesQ.data?.map(inst =>
    pasteName(inst)
             (findTemplate(inst.template)
                          (templates))) ?? []

  const [predicates, setPredicates] = useState([() => true])
  const filteredInstances = filter(ai => {
    return predicates.reduce((acc, pred) => acc && pred(ai), true)
  })(decoratedInstances)
  // console.log('dec inst', decoratedInstances)
  // console.log('preds', predicates)
  // console.log(filteredInstances)

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
        <FilterMenu setPredicates={setPredicates} />
        <div
          className="w-full basis-0 grow min-h-0"
        >
          <EntityListbox
            entities={filteredInstances}
            selected={selectedInstance}
            setSelected={id => setSelectedInstance(id)}
            ItemButtons={DeleteIcon}      
          />
        </div>
        
      </div>


  )
}

export const FilterMenu = ({ setPredicates }) => {
  const [activity, setActivity] = useState("")
  const [before, setBefore] = useState(DateTime.now().toISODate())
  const [after, setAfter] = useState(DateTime.now().minus({ day: 7 }).toISODate())
  const [within, setWithin] = useState({ range: "28", date: DateTime.now().toISODate()})

  const [searching, setSearching] = useState(false)

  const [activeFilters, setActiveFilters] = useState({ activity: true, before: false, after: false, within: false })
  const searchRef = useRef()

  const onlyHasActivityFilter = !activeFilters.before && !activeFilters.after && !activeFilters.within

  useOutsideClick([searchRef], () => setSearching(false))

  useEffect(() => {
    setPredicates([
      ai => {
        const res = activeFilters.before
              ? DateTime.fromISO(ai.createdAt) <= DateTime.fromISO(before) 
              : true
        // console.log('before bool', res)
        return res
      },
      ai => {
        const res = activeFilters.activity
          ? propOr("")("name")(ai).toLowerCase().includes(activity.toLowerCase()) 
          : true
          // console.log('name bool', res)
          return res
      },
      ai => {
        const aiDt = DateTime.fromISO(ai.createdAt)
        const originDt = DateTime.fromISO(within.date)
        const lowerBound = originDt.minus({ day: within.range})
        const upperBound = originDt.plus({ day: within.range})

        const res = activeFilters.within
          ? (lowerBound <= aiDt) && (aiDt <= upperBound)
          : true
        // console.log('within bool', res)
        return res
      }
    ])
  }, [before, activity, within, activeFilters, setPredicates])

  return (
    <div
      className="w-full text-neutral-300 py-1 flex flex-col space-y-2"
    >
      <div
        className="w-full min-w-[24rem] flex flex-col rounded-md space-y-2"
      >
        <div 
          className="w-full flex flex-col bg-neutral-400 rounded-md"
          onFocus={() => setSearching(true)}
          ref={searchRef}
        >
          <div className="flex items-center w-full relative rounded-md bg-neutral-400 px-2 py-1">
            <FilterLabel name="activity" />
            <input
              type="search"
              placeholder={"Search by name"}
              className="w-full py-1 pl-2 text-black bg-neutral-400 outline-none pr-4 placeholder-neutral-700 placeholder:text-xs"
              value={activity}
              onChange={e => setActivity(e.target.value)}
            />
            {
               searching
                ? <div className="absolute right-1 top-1/2 -translate-y-1/2">
                    <AdjustmentsDropdown
                      inactiveFilters={reduce((acc, [name, isActive]) => isActive ? acc : acc.concat(name))
                                             ([])
                                             (toPairs(activeFilters))}
                      activateFilter={name => {
                        if (name === "before") setActiveFilters(assoc("before")(true))
                        if (name === "after") setActiveFilters(assoc("after")(true))
                        if (name === "within") setActiveFilters(assoc("within")(true))
                      }}
                    />
                  </div>
                : <SearchSvg className="w-6 h-6 absolute right-1 top-1/2 -translate-y-1/2 text-neutral-800" />
              }
          </div>
        </div>

        {activeFilters.after && (
          <FilterInterface 
            name="After"
            handleRemove={() => setActiveFilters(prev => ({ ...prev, after: false }))}
            Input={
              <input
                type="date"
                className="bg-neutral-400 text-black"
                value={after}
                onChange={e => setAfter(e.target.value)}
              />
            }
          />
        )}

        {activeFilters.before && (
          <FilterInterface 
            name="Before"
            handleRemove={() => setActiveFilters(prev => ({ ...prev, before: false }))}
            Input={
              <input
                type="date"
                className="bg-neutral-400 text-black"
                value={before}
                onChange={e => setBefore(e.target.value)}
              />
            }
          />
        )}

        {activeFilters.within && (
          <FilterInterface 
            name="Within"
            handleRemove={() => setActiveFilters(prev => ({ ...prev, within: false }))}
            Input={
              <div className="flex flex-col items-center space-x-2">
                <select
                  className="bg-neutral-450 px-1 text-black borderNO border-neutral-800 rounded-sm outline-none"
                  value={within.range}
                  onChange={e => setWithin(prev => ({ ...prev, range: e.target.value }))}
                >
                  <option value={1}>1 day of</option>
                  <option value={3}>3 days of</option>
                  <option value={7}>1 week of</option>
                  <option value={14}>2 weeks of</option>
                  <option value={28}>1 month of</option>
                </select>
                <input
                  type="date"
                  className="bg-neutral-400 text-black outline-none w-max"
                  value={within.date}
                  onChange={e => setWithin(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            }
          />
        )}
      </div>
    </div>
  )
}

const AdjustmentsDropdown = ({ inactiveFilters, activateFilter }) => {
  const [open, setOpen] = useState(false)
  console.log(inactiveFilters)

  return (
    <div className="relative w-max h-max">
      <AdjustmentsSvg 
        className={`w-6 h-6 ${open ? "text-yellow-300" : "text-neutral-800"} rotate-90 cursor-pointer`}
        onClick={() => setOpen(prev => !prev)}
        // onClickCapture={() => {
        //   setFiltering(true)}} 
      />

      {open && 
        <div
          className="absolute top-full right-1/2 bg-neutral-400 flex flex-col items-center space-y-1 w-max p-2 border-2 border-neutral-800 rounded-sm"
        >
          <div className="text-black pb-2">Add filter:</div>
          {inactiveFilters.map(name => 
            <FilterButton 
              key={name} 
              name={name} 
              onClick={() => {
                activateFilter(name)
                setOpen(false)
              }} 
            />)}
          <XCircleSvg 
            className="w-6 h-6 text-neutral-800 fill-neutral-200 absolute top-0 right-0 translate-x-1/2 -translate-y-2/3 cursor-pointer" 
            onClick={() => setOpen(false)}
          />
        </div>}
    </div>
  )
}

const FilterLabel = ({ name, className, ...props }) => {
  return (
    <div className={`h-max w-max px-2 rounded-md bg-neutral-700 cursor-default capitalize`} {...props}>
      {name}
    </div>
  )
}

const FilterButton = ({ name, className, ...props }) => {
  return (
    <div className={`h-max w-max px-2 rounded-md bg-neutral-700 cursor-pointer capitalize`} {...props}>
      {name}
    </div>
  )
}

const FilterInterface = ({ name, Input, handleRemove }) => {
  return (
    <div className="flex items-center max-w-full ">
      <div className="flex space-x-1 items-center pl-1 pr-2 py-1 rounded-md bg-neutral-400">
        <div
          className="h-full px-2 rounded-md bg-neutral-700 cursor-default"
        >{name}</div>
        <div className="">
          {Input}
        </div>
      </div>
      <XSvg 
        className="ml-1 w-6 h-6 cursor-pointer hover:text-red-400" 
        onClick={handleRemove}
      />
    </div>
  )
}