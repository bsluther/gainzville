import { useContext, useEffect, useLayoutEffect, useState } from "react"
import { getInstance } from "../../state/activityInstanceReducer"


const aToG = /[A-G]/i
const hToR = /[H-R]/i
const sToZ = /[S-Z]/i

const colors = {
  ag: '#a82920',
  hr: '#3ca025',
  sz: '#433fc4',
  fallback: '#d8d146f4'
}

const calcColor = letter => {
  if (aToG.test(letter)) {
    return colors['ag']
  } else if (hToR.test(letter)) {
    return colors['hr']
  } else if (sToZ.test(letter)) {
    return colors['sz']
  }
}





export const InstanceBlob = ({ Context, template, handleSaveChanges }) => {
  const [store, dispatch] = useContext(Context)
  const instance = getInstance(store)


  return (
    <div
      style={{ backgroundColor: calcColor(template.name.slice(0, 1)) }}
      className={`w-max h-max px-2 py-2 rounded-xl text-sm`}
      onClick={() => console.log(instance)}
    >
      {template.name}
    </div>
  )
}