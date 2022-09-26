import { identity, map, prop, values } from "ramda"
import { useCallback, useRef, useState } from "react"
import { useEntities } from "../../hooks/queries/entity/useEntities"
import { useFacetTemplates } from "../../hooks/queries/facet/useFacetTemplates"
import { useOutsideClick } from "../../hooks/useOutsideClick"
import { useRecentFacets } from "../../hooks/useRecentFacets"
import { SearchSvg } from "../../svg/SearchSvg"
import { allSucceeded, debounce } from "../../utility/fns"
import { FacetTemplateModal } from "./FacetTemplateModal"


export const FacetBar = ({ handleSelect = identity, handleOutsideClick = identity, handleCreateFacet }) => {
  const ref = useRef()
  const [inputState, setInputState] = useState("")
  const [searchState, setSearchState] = useState("")
  const resultsQ = useFacetTemplates({ name: searchState }, { enabled: !!searchState })
  const recentFacetIdsQ = useRecentFacets(null, 4)
  const recentFacetsQ = useEntities(recentFacetIdsQ.data, { enabled: recentFacetIdsQ.isSuccess })
  const recentFacets = map(prop('data'))
                          (values(recentFacetsQ ?? {}))
  // const [creatingFacet, setCreatingFacet] = useState(false)

  const handleInput = useCallback(e => {
    setInputState(e.target.value)
    debounce(e => setSearchState(e.target.value), 500)(e)
  }, [])
  
  const clearSearch = () => {
    setInputState("")
    setSearchState("")
  }
  
  useOutsideClick([ref], handleOutsideClick)
  const areRecents = recentFacets.length > 0
  const areResults = resultsQ.data?.length > 0
  const searching = searchState.length > 0
  const isExpanded = (searching && areResults) || areRecents

  return (
    <div className={`w-2/3 h-max`} ref={ref}>
      <div className={`w-full h-max ${isExpanded && "bg-neutral-750 rounded-t-xl"}`}>
        <div 
          className="w-full bg-neutral-300 border border-neutral-800 rounded-lg flex px-2 py-2 space-x-2 items-center justify-center"
        >
          <SearchSvg className="w-5 h-5 text-black" />
          <input
            autoFocus
            className="w-full outline-none bg-neutral-300 text-neutral-800 placeholder-neutral-600 appearance-none" 
            value={inputState}
            onChange={handleInput}
            type="search"
            spellCheck="false"
            placeholder="find a facet"
          />
          {/* <AdjustmentsSvg className="w-7 h-7 -rotate-90 text-neutral-400" /> */}
        </div>
      </div>

      <div className="bg-neutral-750 text-neutral-300 rounded-b-xl max-h-[12rem] overflow-scroll no-scrollbar">
        <ol className="flex flex-col">

          {areResults &&
              <Results 
                templates={resultsQ.data} 
                handleSelect={(...args) => {
                  clearSearch()
                  handleSelect(...args)
                }} 
              />}

          <Recents
            templates={recentFacets}
            handleSelect={(...args) => {
              clearSearch()
              handleSelect(...args)
            }}
          />

          <span className="px-2 mb-2 font-bold" onClick={handleCreateFacet}>+ Create New Facet</span>
        </ol>
      </div>
      
      {/* {creatingFacet && 
        <FacetTemplateModal closeModal={() => setCreatingFacet(false)} />} */}
    </div>
  )
}

const Recents = ({ templates = [], handleSelect }) => {
  const typeTemplatesQ = useEntities(templates.flatMap(tmpl => tmpl.fields))

  return (
      <div className="flex flex-col p-2">
        <span className="font-bold">Recent:</span>
        <ul className="flex flex-col p-2 space-y-2">
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
        </ul>
      </div>
  )
}

const Results = ({ templates = [], handleSelect }) => {
  const typeTemplatesQ = useEntities(templates.flatMap(tmpl => tmpl.fields))
  console.log(templates)

  return (
        <div className="flex flex-col p-2 space-y-2 bg-neutral-700">
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
        </div>
  )
}