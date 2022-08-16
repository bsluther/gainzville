import { find, head, prop, propEq, propOr, reduce } from "ramda"
import { useState } from "react"
import { useActivityTemplatesById } from "../../hooks/queries/activity/template/useActivityTemplatesById"
import { useLibraries } from "../../hooks/queries/library/useLibraries"
import { useUser } from "../../hooks/queries/user/useUser"
import { PlusSvg } from "../../svg/PlusSvg"
import { SearchSvg } from "../../svg/SearchSVG"
import { EntityListbox } from "../EntityListbox"
import { Link } from "react-router-dom"
// AKA ActivityTemplateBrowser...

const unwrapSuccesses = queries =>
  reduce((acc, q) =>
            q.isSuccess ? acc.concat(q.data) : acc)
        ([])
        (queries)

const Button = props =>
  <button
    className="w-max h-max bg-neutral-300 text-neutral-800 px-2 py-1 rounded-md"
    {...props}>{props.children}</button>

export const LibraryBrowser = ({ selectedTemplate, setSelectedTemplate }) => {
  const [selectedLibrary, setSelectedLibrary] = useState()
  const handleSelectTemplate = id => {
    setSelectedTemplate(id)
  }

  const userQ = useUser()
  const librariesQ = useLibraries(
    userQ.data?.libraries, 
    {
      enabled: userQ.isSuccess,
      onSuccess: data => setSelectedLibrary(prop("id")
                                                (head(data)))
    }
  )
  const templatesQ = useActivityTemplatesById(
    prop("elements")
        (find(propEq("id")
                    (selectedLibrary))
             (propOr([])
                    ("data")
                    (librariesQ))),
    { enabled: librariesQ.isSuccess }
  )

  return (
    <div
      className="
        w-full h-full
        bg-neutral-800
        flex flex-col pb-4 px-4
      "
    >
      <div className="
        w-full h-max
        flex items-center space-x-4 pb-4">

        <select
          className="
            w-full p-1
          bg-neutral-700 text-neutral-300
            outline-none rounded-md
          "
          onChange={e => setSelectedLibrary(e.target.value)}
          value={selectedLibrary}
        >
          {librariesQ.isSuccess &&
            librariesQ.data.map(lib => 
              <option key={lib.id} value={lib.id}>{lib.name}</option>
            )}
        </select>
      </div>

      <div className="h-full">
        <EntityListbox
          entities={unwrapSuccesses(templatesQ)}
          selected={selectedTemplate}
          setSelected={handleSelectTemplate}
        />
      </div>
      <div className="flex items-center justify-center space-x-2 pt-4">
        <WithTooltip tip="Find Activities">
          <Link to="template-search">
            <Button>
              <SearchSvg
                className="w-6 h-6" 
              />
            </Button>
          </Link>
        </WithTooltip>
        <WithTooltip tip="Create New Activity">
          <Link to="template-create">
            <Button>
              <PlusSvg className="w-6 h-6" />
            </Button>
          </Link>
        </WithTooltip>
      </div>
    </div>
  )
}

const WithTooltip = ({ children, tip }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="w-max h-max relative" 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      {hovered &&
        <div
          className="
            absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-1
            bg-neutral-800 text-neutral-200 text-sm text-center rounded-sm
            w-max px-1
          "
        >{tip}</div>
      }
    </div>
  )
}