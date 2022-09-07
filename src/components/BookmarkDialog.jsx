import { useAuth0 } from "@auth0/auth0-react"
import { find, map, propEq } from "ramda"
import { useState } from "react"
import { useQueryClient } from "react-query"
import { appendElement, constructLibrary, setLibraryName } from "../data/Library"
import { useInsertLibrary } from "../hooks/queries/library/useInsertLibrary"
import { useReplaceLibrary } from "../hooks/queries/library/useReplaceLibrary"
import { useUserLibraries } from "../hooks/queries/library/useUserLibraries"
import { useUpdateUser } from "../hooks/queries/user/useUpdateUser"
import { chWidth } from "../utility/fns"
import { WithTooltip } from "../components/WithTooltip"
import { Loading } from "./Loading"
import { XCircleSvg } from "../svg/XCircleSvg"
import { XSvg } from "../svg/XSvg"
import { CheckSvg } from "../svg/CheckSvg"

export const BookmarkDialog = ({ template, stopBookmarking }) => {
  const queryClient = useQueryClient()
  const librariesQ = useUserLibraries()
  const updateLibraryM = useReplaceLibrary({
    onSettled: () => {
      queryClient.invalidateQueries(["libraries"])
    }
  })
  const updateUserM = useUpdateUser({
    onSettled: () => {
      queryClient.invalidateQueries(["libraries"])
      queryClient.invalidateQueries(["users"])
    }
  })
  const [creatingLibrary, setCreatingLibrary] = useState(false)
  const [selectedLibrary, setSelectedLibrary] = useState()
  const [renaming, setRenaming] = useState()

  const loading = updateUserM.isLoading

  return (
    <div className="relative flex flex-col items-center space-y-2 w-max p-2 h-max bg-neutral-300 rounded-md">
      <div className="flex items-center space-x-2 px-8 w-max">
        <span>Save</span>
        <span
          className="bg-neutral-300 text-neutral-800 font-bold px-1 rounded-md"
        >"{template.name}"</span>
        <span>to a library:</span>
      </div>
      <ul className="grow w-full border border-neutral-800 rounded-md py-1">
        {librariesQ.isSuccess &&
          map(lib =>
            <li
              className={`flex w-full hover:bg-neutral-400 px-2 items-center
                ${selectedLibrary === lib.id && "bg-yellow-300 hover:bg-yellow-300"}`}
              key={lib.id}
            >
              {renaming === lib.id
                ? <Renaming 
                    library={lib} 
                    endRenaming={() => setRenaming(null)} 
                  />
                : <span
                    className="grow cursor-pointer"
                    onClick={() => {
                      if (selectedLibrary === lib.id) {
                        setRenaming(lib.id)
                      }
                      else {
                        setRenaming(null)
                        setSelectedLibrary(lib.id)
                      }
                    }}
                  >{lib.name}</span>}
              {selectedLibrary === lib.id &&
                <WithTooltip tip="Remove library">
                  <XSvg
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => {
                      updateUserM.mutate({ $pull: { libraries: lib.id } })
                    }}
                  />
                </WithTooltip>}
              {(updateLibraryM.isLoading &&
                updateLibraryM?.variables?.id === lib.id) ||
                librariesQ.isLoading &&
                <Loading className="w-4 h-4" />}
            </li>)(librariesQ.data)}
        {creatingLibrary
          ? <NewLibrary
              endCreating={() => setCreatingLibrary(false)}
              template={template}
              stopBookmarking={stopBookmarking}
            />
          : <li
              key="new"
              className="cursor-pointer hover:bg-neutral-400 px-2"
              onClick={() => {
                setCreatingLibrary(true)
                setSelectedLibrary(null)
              }}
            >+ create new library</li>}
      </ul>

      {selectedLibrary && 
        <button
          className="w-max px-1 bg-neutral-800 text-neutral-200 border-2 border-neutral-800 rounded-md"
          onClick={() => {
            const foundLib = find(propEq("id")(selectedLibrary))(librariesQ.data)
            updateLibraryM.mutate(
              appendElement(template.id)(foundLib),
              { onSuccess: () => stopBookmarking() }
            )
          }
          }
        >Save</button>}

      <XCircleSvg
        className="absolute right-0 bottom-full translate-x-1/2 translate-y-1/2 w-6 h-6 text-neutral-300 cursor-pointer"
        fill="rgb(38 38 38)"
        onClick={() => stopBookmarking()} />

      {loading &&
        <div className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2">
          <Loading
            className="opacity-20 w-10 h-10"
          />
        </div>}
    </div>
  )
}

const Renaming = ({ library, endRenaming }) => {
  const [name, setName] = useState(library.name)
  const queryClient = useQueryClient()
  const updateLibraryM = useReplaceLibrary({
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        ["libraries", library.id],
        variables
      )
    }
  })

  return (
    <div className="flex space-x-2 w-full">
      <div className="grow">
        <input
          autoFocus
          style={{ width: chWidth(name, 2) }}
          className={`rounded-sm outline-none text-center`}
          value={name}
          onChange={e => setName(e.target.value)} 
          onBlur={() => {
            endRenaming()
            updateLibraryM.mutate(setLibraryName(name)(library))
          }}
        />
      </div>

      {updateLibraryM.isLoading && <Loading className="w-4 h-4" />}
    </div>
  )
}

const NewLibrary = ({ endCreating, stopBookmarking, template }) => {
  const insertLibraryM = useInsertLibrary()
  const { user } = useAuth0()
  const [name, setName] = useState("New library")

  return (
    <div 
      className="flex space-x-2 px-2 items-center w-full"
    >
      <WithTooltip tip={`Save "${template.name}" to "${name}"`}>
          <CheckSvg 
            className="w-4 h-4 hover:text-green-600 cursor-pointer" 
            onClick={() => {
              endCreating()
              insertLibraryM.mutate(
                appendElement(template.id)
                             (constructLibrary(user?.sub)
                             (name)),
                {
                  onSuccess: () => stopBookmarking()
                }
              )
            }}
          />
      </WithTooltip>
      <input
        autoFocus
        onFocus={e => e.target.select()}
        style={{ width: chWidth(name, 2) }}
        className={`rounded-md outline-none text-center px-2`}
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <span className="grow" />
      <WithTooltip tip={"Cancel"}>
        <XSvg
          tabIndex="0"
          id="xCircle"
          className="w-4 h-4 cursor-pointer hover:text-red-500" 
          onClick={() => {
            endCreating()
          }}
        />
      </WithTooltip>
    </div>
  )
}