import { identity } from "ramda"
import { useCallback, useRef, useState } from "react"
import { useEntities } from "../../hooks/queries/entity/useEntities"
import { useFacetTemplates } from "../../hooks/queries/facet/useFacetTemplates"
import { SearchSvg } from "../../svg/SearchSvg"
import { allSucceeded, debounce } from "../../utility/fns"


export const FacetBar = ({ handleSelect = identity }) => {
  const ref = useRef()
  const [inputState, setInputState] = useState("")
  const [searchState, setSearchState] = useState("")
  const resultsQ = useFacetTemplates({ name: searchState }, { enabled: !!searchState })

  const handleInput = useCallback(e => {
    setInputState(e.target.value)
    debounce(e => setSearchState(e.target.value), 500)(e)
  }, [])

  const areResults = resultsQ.data?.length > 0

  return (
    <div className={`w-2/3 h-max`} ref={ref}>
      <div className={`w-full h-max ${areResults && "bg-neutral-750 rounded-t-xl"}`}>
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
            spellCheck="false"
            placeholder="find a facet"
          />
          {/* <AdjustmentsSvg className="w-7 h-7 -rotate-90 text-neutral-400" /> */}
        </div>
      </div>
      {areResults > 0 &&
        <Results 
          templates={resultsQ.data} 
          handleSelect={(...args) => {
            handleSelect(args)
          }} 
        />
      }
    </div>
  )
}

const Results = ({ templates = [], handleSelect }) => {
  const typeTemplatesQ = useEntities(templates.flatMap(tmpl => tmpl.fields))

  return (
    <div className="bg-neutral-750 text-neutral-300 rounded-b-xl py-2 max-h-[10rem] overflow-scroll no-scrollbar">
      <ol className="flex flex-col px-2">
        {templates.map(tmpl => 
          <span 
            key={tmpl.id}
            onClick={() => {
              const typeTemplateQs = tmpl.fields.map(id => typeTemplatesQ[id])
              if (allSucceeded(typeTemplateQs)) {
                handleSelect(tmpl, typeTemplateQs.map(qry => qry.data))
              }
            }}
          >{tmpl.name}</span>)}
      </ol>
    </div>
  )
}