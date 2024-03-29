import { map, prop, values } from "ramda"
import { useCallback, useRef } from "react"
import { useState } from "react"
import { useActivityTemplates } from "../../hooks/queries/activity/template/useActivityTemplates"
import { useRecentActivities } from "../../hooks/queries/activity/useRecentActivities"
import { useEntities } from "../../hooks/queries/entity/useEntities"
import { useOutsideClick } from "../../hooks/useOutsideClick"
import { AdjustmentsSvg } from "../../svg/AdjustmentsSvg"
import { DotSvg } from "../../svg/DotSvg"
import { SearchSvg } from "../../svg/SearchSvg"
import { debounce } from "../../utility/fns"

export const RecordBar = ({ handleStartCreatingInstance, startCreatingTemplate }) => {
  const ref = useRef()
  const [mode, setMode] = useState("inactive")
  const [inputState, setInputState] = useState("")
  const [searchState, setSearchState] = useState("")
  const resultsQ = useActivityTemplates({ name: searchState }, { enabled: !!searchState })

  const recentActivitiesIdsQ = useRecentActivities()
  const recentActivitiesQ = useEntities(recentActivitiesIdsQ.data, { enabled: recentActivitiesIdsQ.isSuccess })
  const recentActivities = map(prop("data"))(values(recentActivitiesQ))

  const handleInput = useCallback(e => {
    setInputState(e.target.value)
    debounce(e => setSearchState(e.target.value), 500)(e)
  }, [])

  const clearSearch = () => {
    setMode("inactive")
    setInputState("")
    setSearchState("")
  }

  const areResults = resultsQ.data?.length > 0
  const areRecents = recentActivities.length > 0

  const isExpanded = mode !== "inactive"
    // && (areResults || areRecents)

  useOutsideClick([ref], () => setMode("inactive"))

  const handleStartCreatingTemplate = () => {
    startCreatingTemplate()
    clearSearch()
  }



  if (mode === "searching") return (
    <div className={`w-full h-max`} ref={ref}>
      <div className={`w-full h-max ${isExpanded && "bg-neutral-750 rounded-t-xl"}`}>
        <div 
          className="w-full bg-neutral-800 rounded-xl flex px-2 py-2 space-x-2 items-center justify-center"
        >
          <SearchSvg className="w-5 h-5 text-neutral-400" />
          <input
            autoFocus
            className="w-full outline-none bg-neutral-800 text-neutral-200 appearance-none" 
            value={inputState}
            onChange={handleInput}
            // type="search"
            placeholder="search activities"
            spellCheck="false"
          />
          <AdjustmentsSvg className="w-7 h-7 -rotate-90 text-neutral-400" />
        </div>
      </div>
      <div className="bg-neutral-750 text-neutral-300 rounded-b-xl">
        {areResults &&
          <Results 
            templates={resultsQ.data} 
            handleSelect={templateId => {
              handleStartCreatingInstance(templateId)
              clearSearch()
            }} 
          />
        }
        {areRecents && !areResults &&
          <Recents
            templates={recentActivities}
            handleSelect={templateId => {
              handleStartCreatingInstance(templateId)
              clearSearch()
            }}
          />
        }
        <div className="pl-4 pb-2 flex flex-col">
          <span className="font-bold" onClick={handleStartCreatingTemplate}>+ Create new activity</span>
          {/* <span className="px-2 italic text-sm">Something missing? Make your own activities!</span> */}
        </div>
      </div>
    </div>
  )

  return(
    <div 
      className="w-full h-11 bg-neutral-800 text-neutral-200 rounded-xl py-2 space-x-2 flex items-center justify-center"
      onClick={() => setMode("searching")}
    >
      <div>
        <DotSvg className="w-3 h-3 text-red-600" />
      </div>
      <span className="font-semibold uppercaseNO capitalize">Record your activity</span>
    </div>
  )
}

const Recents = ({ templates = [], handleSelect }) => {
  console.log(templates)
  return (
    <ol className={`flex flex-col pt-2 px-4 rounded-b-xl`}>
      <span className="font-bold">Recent activities:</span>
      <div className="flex flex-col px-2 pb-2">
        {templates.map(tmpl => 
          <span 
            key={tmpl?.id}
            onClick={() => handleSelect(tmpl?.id)}
          >{tmpl?.name}</span>)}
      </div>
    </ol>
  )
}

const Results = ({ templates = [], handleSelect }) => {
  return (
    <ol className="flex flex-col py-2 px-4 rounded-b-lg">
      {templates.map(tmpl => 
        <span 
          key={tmpl.id}
          onClick={() => handleSelect(tmpl.id)}
        >{tmpl.name}</span>)}
    </ol>
  )
}