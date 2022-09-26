import { useEffect, useRef, useState } from "react"
import { useOutsideClick } from "../../hooks/useOutsideClick"
import { chWidth } from "../../utility/fns"

export const Renamable = ({ name, setName }) => {
  const [renaming, setRenaming] = useState(true)
  const inputRef = useRef()

  useOutsideClick([inputRef], () => setRenaming(false))

  useEffect(() => {
    inputRef.current?.select()
  }, [inputRef.current])

  return (
    <div>
      {renaming
        ? <>
            <input
              autoFocus
              // onFocus={e => {
              //   if (name === "New facet") {
              //     e.target.select()
              //   }}}
              ref={inputRef}
              style={{ width: chWidth(name) }}
              className="text-center outline-none bg-white"
              value={name} 
              onChange={e => setName(e.target.value)}
            />
        </>
        : <span
            className="cursor-text bg-inherit px-1"
            onClick={() => setRenaming(true)}
          >{name}</span>}
    </div>
  )
}