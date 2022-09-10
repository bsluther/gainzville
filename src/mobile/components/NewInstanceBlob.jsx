import { useCallback, useRef } from "react"
import { useState } from "react"
import { useActivityTemplates } from "../../hooks/queries/activity/template/useActivityTemplates"
import { useOutsideClick } from "../../hooks/useOutsideClick"
import { AdjustmentsSvg } from "../../svg/AdjustmentsSvg"
import { SearchSvg } from "../../svg/SearchSvg"
import { debounce } from "../../utility/fns"

const Results = ({ templates = [] }) => {
  return (
    <div className="bg-neutral-400 rounded-b-xl py-2">
      <ol className="flex flex-col px-2">
        {templates.map(tmpl => <span key={tmpl.id}>{tmpl.name}</span>)}
      </ol>
    </div>
  )
}

export const NewInstanceBlob = () => {
  const ref = useRef()
  const [mode, setMode] = useState("inactive")
  const [inputState, setInputState] = useState("")
  const [searchState, setSearchState] = useState("")
  const resultsQ = useActivityTemplates({ name: searchState}, { enabled: !!searchState })


  const handleInput = useCallback(e => {
    setInputState(e.target.value)
    debounce(e => setSearchState(e.target.value), 500)(e)
  }, [])

  const areResults = resultsQ.data?.length > 0

  useOutsideClick([ref], () => setMode("inactive"))

  if (mode === "searching") return (
    <div className={`w-full h-max`} ref={ref}>
      <div className={`w-full h-max ${areResults && "bg-neutral-400 rounded-t-xl"}`}>
        <div 
          className="w-full bg-neutral-300 rounded-xl flex px-2 py-2 space-x-2 items-center justify-center"
        >
          <SearchSvg className="w-5 h-5 text-neutral-600" />
          <input 
            className="w-full outline-none bg-neutral-300 appearance-none" 
            value={inputState}
            onChange={handleInput}
            // type="search"
            spellCheck="false"
          />
          <AdjustmentsSvg className="w-7 h-7 -rotate-90 text-neutral-600" />
        </div>
      </div>
      {areResults > 0 &&
        <Results templates={resultsQ.data} />
      }
    </div>
  )

  return(
    <div 
      className="w-full h-11 bg-neutral-300 rounded-xl py-2 flex items-center justify-center"
      onClick={() => setMode("searching")}
    >
      <span className="font-semibold uppercaseNO capitalize">Record your activity</span>
    </div>
  )
}