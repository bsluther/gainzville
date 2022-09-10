import { useState } from "react"
import { AdjustmentsSvg } from "../../svg/AdjustmentsSvg"
import { SearchSvg } from "../../svg/SearchSvg"


export const NewInstanceBlob = () => {
  const [mode, setMode] = useState("inactive")
  const [inputState, setInputState] = useState("")

  if (mode === "searching") return (
    <div 
      className="w-full bg-neutral-300 rounded-xl flex px-2 py-2 space-x-2 items-center justify-center"
    >
      <SearchSvg className="w-5 h-5 text-neutral-600" />
      <input 
        className="w-full outline-none bg-neutral-300" 
        value={inputState}
        onChange={e => setInputState(e.target.value)}
      />
      <AdjustmentsSvg className="w-7 h-7 -rotate-90 text-neutral-600" />
    </div>
  )

  return(
    <div 
      className="w-full bg-neutral-300 rounded-xl py-2 flex justify-center"
      onClick={() => setMode("searching")}
    >
      <span className="font-semibold uppercaseNO capitalize">Record your activity</span>
    </div>
  )
}