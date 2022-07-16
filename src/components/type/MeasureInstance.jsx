import { useContext } from "react"
import { chWidth } from "../../utility/fns"
import { InstanceContext } from "../../state/activityInstanceReducer"
import { getField } from "../../data/ActivityInstance"
import regex from "../../utility/regex"
import { getActiveUnits, getQuantity, setQuantity } from "../../data/typeInstance/MeasureInstance"

const variantHash = {
  mass: {
    units: {
      lb: {
        aliases: ["lbs", "pound", "pounds"],
      },
      kg: {
        aliases: ["kgs", "kilogram", "kilograms"]
      }
    },
  },
  length: {
    units: {
      mile: {
        aliases: ["mi", "miles"]
      }
    }
  }
}

export function MassInstance({ typeInstance, address }) {
  return (
    <MeasureInstance variant={'mass'} typeInstance={typeInstance} address={address} />
  )
}

export function LengthInstance({ typeInstance, address }) {
  return (
    <MeasureInstance variant={'length'} typeInstance={typeInstance} address={address} />
  )
}

export const DurationInstance = ({ typeInstance, address}) =>
  <MeasureInstance variant={"duration"} typeInstance={typeInstance} address={address} />

const UnitQuantity = ({ unit, quantity, onChange }) =>
  <div className="flex space-x-1 items-center">
    <input
      style={{ width: chWidth(quantity) }}
      className="
        h-7
        border-2 border-neutral-800 rounded-l-sm
        bg-neutral-400 focus:bg-neutral-400
        text-center outline-none"
      value={quantity ?? ""} 
      onChange={onChange}
    />
    <div 
      className=" 
        bg-neutral-500 text-neutral-800
        cursor-default
        pr-1 text-sm"
    >{unit}</div>
  </div>

export function MeasureInstance({ variant, address }) {
  const [store, dispatch] = useContext(InstanceContext)
  const value = getField(address)(store)

  const activeUnits = value ? getActiveUnits(value) : []

  return (
    <>
      {activeUnits?.map(unit =>
        <UnitQuantity
          key={unit}
          quantity={getQuantity(unit)(value)} 
          unit={unit} 
          onChange={e =>
            regex.float.test(e.target.value)
            ? dispatch({
                type: 'input',
                payload: {
                  address,
                  value: setQuantity(unit)(e.target.value)(value)
                }
              })
            : null} 
          />)}
    </>
  )
}