import { find, head, prop, propEq, propOr, reduce } from "ramda"
import { useState } from "react"
import { useActivityTemplatesById } from "../../hooks/queries/activity/template/useActivityTemplatesById"
import { useLibraries } from "../../hooks/queries/library/useLibraries"
import { useUser } from "../../hooks/queries/user/useUser"
import { EntityListbox } from "../EntityListbox"

// AKA ActivityTemplateBrowser...

const unwrapSuccesses = queries =>
  reduce((acc, q) =>
            q.isSuccess ? acc.concat(q.data) : acc)
        ([])
        (queries)

const Button = props =>
  <button
    className="bg-neutral-300 text-neutral-800 w-max h-max"
    {...props}>{props.children}</button>

export const LibraryBrowser = ({ Buttons = <Button />, reportSelectedTemplate }) => {
  const [selectedLibrary, setSelectedLibrary] = useState()
  const [selectedTemplate, setSelectedTemplate] = useState()
  const handleSelectTemplate = id => {
    setSelectedTemplate(id)
    reportSelectedTemplate(id)
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
        bg-neutral-800 border-2NOT border-neutral-800 rounded-mdNOT
        flex flex-col pb-4 px-4
      "
    >
      <div className="
        w-full h-max
        flex items-center space-x-4 pb-4">
        {/* <span className="text-neutral-100 font-semibold">Library</span> */}
        <select
          className="
            w-full p-1
          bg-neutral-700 text-neutral-300
            outline-none  border-2NOT rounded-md border-neutral-600
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
        {Buttons}
      </div>
    </div>
  )
}