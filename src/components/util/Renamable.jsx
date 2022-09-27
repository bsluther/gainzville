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
              onFocus={e => e.target.select()}
              ref={inputRef}
              style={{ width: chWidth(name) }}
              className="text-center outline-none bg-white"
              value={name} 
              onChange={e => setName(e.target.value)}
              
            />
        </>
        : <div
            className="cursor-text bg-white px-1 py-1 text-center"
            onClick={() => setRenaming(true)}
          >{name}</div>}
    </div>
  )
}