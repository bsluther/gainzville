import { useMemo, useState } from "react"
import { debounce } from "../../utility/fns"
import { SearchSvg } from "../../svg/SearchSvg"
import { useActivityTemplates } from "../../hooks/queries/activity/template/useActivityTemplates"

export const ActivityTemplateSearch = ({
  title = "Search",
  handleSelect = x => x,
  ResultButtons = () => <></>
}) => {
  const [inputState, setInputState] = useState("")
  const [searchState, setSearchState] = useState("")

  const resultsQ = useActivityTemplates({ name: searchState }, { enabled: !!searchState })

  const handleInput = useMemo(
    () => e => {
      setInputState(e.target.value)
      debounce(e => setSearchState(e.target.value), 500)(e)
    }, [])

  return (
    <div className="bg-neutral-800 border-2 border-neutral-800 rounded-md w-50 px-4 py-2 space-y-2 flex flex-col">
      <span className="text-neutral-400 font-semibold self-center">{title}</span>
      <div className="relative w-full">
        <input
          className={`
            bg-neutral-400
            outline-none border-2 border-neutral-800 rounded-md
            pl-2 pr-8 w-full
          `}
          value={inputState}
          onChange={handleInput} />
        <SearchSvg className="absolute w-5 h-5 top-1 right-2" />
      </div>
      <ul className="min-h-[1.5rem] h-max px-1">
        {resultsQ.isSuccess &&
          resultsQ.data.length > 0
          ? resultsQ.data.map(tmpl => 
              <div
                className="flex items-center space-x-1"
                key={tmpl.id}
              >
                <li
                  className="grow text-neutral-300 hover:text-neutral-300 cursor-pointer"
                  onClick={() => handleSelect(tmpl.id)}
                >{tmpl.name}</li>
                {<ResultButtons id={tmpl.id} template={tmpl} />}
              </div>
          )
          : <li className="text-neutral-400">no results...</li>}
      </ul>
    </div>
  )
}
