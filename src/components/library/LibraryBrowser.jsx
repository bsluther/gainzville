import { find, ifElse, pipe, prop, propEq, propOr, reduce, sort, sortBy, union } from "ramda"
import { useState } from "react"
import { useActivityTemplatesById } from "../../hooks/queries/activity/template/useActivityTemplatesById"
import { PlusSvg } from "../../svg/PlusSvg"
import { SearchSvg } from "../../svg/SearchSvg"
import { EntityListbox } from "../EntityListbox"
import { Link, useNavigate } from "react-router-dom"
import { WithTooltip } from "../WithTooltip"
import { useUserLibraries } from "../../hooks/queries/library/useUserLibraries"
import { XSvg } from "../../svg/XSvg"
import { PencilAltSvg } from "../../svg/PencilAltSvg"
import { useReplaceLibrary } from "../../hooks/queries/library/useReplaceLibrary"
import { removeElement } from "../../data/Library"
import { Loading } from "../Loading"
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
  const [selectedLibrary, setSelectedLibrary] = useState("all")
  const librariesQ = useUserLibraries()
  const updateLibraryM = useReplaceLibrary() 
  const navigate = useNavigate()

  const templateIds = pipe(
    propOr([])
          ("data"),
    ifElse(() => selectedLibrary === "all")
          (libs =>
            reduce((acc, x) => union(acc)(x.elements))
                  ([])
                  (libs))
          (libs => prop("elements")
                       (find(propEq("id")
                                   (selectedLibrary))
                            (libs)))
  )(librariesQ)

  const templatesQ = useActivityTemplatesById(
    templateIds,
    { enabled: librariesQ.isSuccess }
  )

  const TemplateButtons = ({ id, className }) => {
    return (
      <div className="flex space-x-1">
        <WithTooltip tip="Edit template">
          <PencilAltSvg
            onClick={e => {
              e.stopPropagation()
              navigate("template-edit")
            }}
            className={`w-4 h-4 ${className}`}
          />
        </WithTooltip>

        {updateLibraryM.isLoading && updateLibraryM.variables?.id === selectedLibrary
          ? <Loading className={` ${className} w-4 h-4`} />
          : <WithTooltip tip="Remove from library">
              <XSvg
                className={`w-4 h-4 ${selectedLibrary === "all" && "hidden"} ${className}`}
                onClick={e => {
                  e.stopPropagation()
                  const currentLibrary = find(propEq("id")(selectedLibrary))
                                            (librariesQ?.data)
            
                  updateLibraryM.mutate(removeElement(id)(currentLibrary))
                }}
              />
            </WithTooltip>}
      </div>
    )
  }

  return (
    <div
      className="
        w-full h-full NO grow
        bg-neutral-800
        flex flex-col pb-4 px-4 space-y-2
      "
    >
      <div className="
        w-full h-max
        flex items-center space-x-4">

        <select
          className="
            w-full p-1
          bg-neutral-700 text-neutral-300
            outline-none rounded-md
          "
          onChange={e => setSelectedLibrary(e.target.value)}
          value={selectedLibrary}
        >
          <option key="all" value="all">all libraries</option>
          {librariesQ.isSuccess &&
            librariesQ.data.map(lib => 
              <option key={lib.id} value={lib.id}>{lib.name}</option>
            )}
        </select>
      </div>

      {/* <div className="flex space-x-2 px-2 justify-center items-center">
        <WithTooltip tip="Only view activities you created">
          <input className="text-neutral-500" type="checkbox" />
        </WithTooltip>
        <span className="text-neutral-300">created by me</span>
      </div>

      <div className="flex space-x-2 px-2 justify-center items-center">
        <WithTooltip tip="View activities by tag">
          <input className="text-neutral-500" type="checkbox" />
        </WithTooltip>
        <span className="text-neutral-300">filter by tag</span>
        <select
          className="bg-neutral-300"
        >
          <option>climbing</option>
          <option>achilles</option>
        </select>
      </div> */}

      <div className="basis-0 grow min-h-0">
        <EntityListbox
          entities={sortBy(prop("name"))(unwrapSuccesses(templatesQ))}
          selected={selectedTemplate}
          setSelected={setSelectedTemplate}
          ItemButtons={TemplateButtons}
        />
      </div>
      <div className="flex items-center justify-center space-x-2 pt-2">
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

