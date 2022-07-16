import { useEffect } from "react"

export const useOutsideClick = (refs, callback) => {

  useEffect(() => {
    const handleOutsideClick = e => {

      const isOutside = refs.reduce((acc, ref) => 
                                      acc 
                                      && ref.current 
                                      &&  !ref.current.contains(e.target),
                                    true)

      if (isOutside) {
        callback()
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)

    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [refs, callback])
}