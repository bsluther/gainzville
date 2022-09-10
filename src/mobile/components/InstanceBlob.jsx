import { useContext, useEffect, useLayoutEffect, useState } from "react"
import { getInstance } from "../../state/activityInstanceReducer"


const aToG = /[A-G]/i
const hToR = /[H-R]/i
const sToZ = /[S-Z]/i

const calcColorGroup = letter => {
  if (aToG.test(letter)) {
    return 'ag'
  } else if (hToR.test(letter)) {
    return 'hr'
  } else if (sToZ.test(letter)) {
    return 'sz'
  }
  else {
    console.log('elsing', letter)
  }
}

const colors = {
  ag: '#a82920',
  hr: '#3ca025',
  sz: '#433fc4',
  fallback: '#d8d146f4'
}




export const InstanceBlob = ({ Context, template, handleSaveChanges }) => {
  const [store, dispatch] = useContext(Context)
  const instance = getInstance(store)


  return (
    <div
      style={{ backgroundColor: colors[calcColorGroup(template.name.slice(0, 1))] }}
      className={`w-max h-max px-2 py-2 rounded-xl text-sm`}
      onClick={() => console.log(instance)}
    >
      {template.name}
    </div>
  )
}