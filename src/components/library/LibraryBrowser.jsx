import { find, ifElse, pipe, prop, propEq, propOr, reduce, union } from "ramda"
import { useState } from "react"
import { useActivityTemplatesById } from "../../hooks/queries/activity/template/useActivityTemplatesById"
import { PlusSvg } from "../../svg/PlusSvg"
import { SearchSvg } from "../../svg/SearchSVG"
import { EntityListbox } from "../EntityListbox"
import { Link, useNavigate } from "react-router-dom"
import { WithTooltip } from "../WithTooltip"
import { useUserLibraries } from "../../hooks/queries/library/useUserLibraries"
import { XSVG } from "../../svg/XSVG"
import { PencilAltSvg } from "../../svg/PencilAltSvg"
import { useUpdateLibrary } from "../../hooks/queries/library/useUpdateLibrary"
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
  const updateLibraryM = useUpdateLibrary() 
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


  const TemplateButtons = ({ id, className }) =>
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

      {updateLibraryM.isLoading && updateLibraryM.variables?.id === id
        ? <Loading className={` ${className} w-4 h-4`} />
        : <WithTooltip tip="Remove from library">
            <XSVG
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
          <option key="all" value="all">all libraries</option>
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
          setSelected={setSelectedTemplate}
          ItemButtons={TemplateButtons}
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

