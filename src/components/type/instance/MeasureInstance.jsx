import { useContext } from "react"
import { chWidth } from "../../../utility/fns"
import regex from "../../../utility/regex"
import { getActiveUnits, getQuantity, setQuantity } from "../../../data/typeInstance/MeasureInstance"

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

export function MassInstance({ Context, typeInstance, address }) {
  return (
    <MeasureInstance
      Context={Context}
      variant={'mass'} 
      typeInstance={typeInstance} 
      address={address} 
    />
  )
}

export function LengthInstance({ Context, typeInstance, address }) {
  return (
    <MeasureInstance
      Context={Context}
      variant={'length'} 
      typeInstance={typeInstance} 
      address={address} 
    />
  )
}

export const DurationInstance = ({ Context, typeInstance, address}) =>
  <MeasureInstance
    Context={Context}
    variant={"duration"} 
    typeInstance={typeInstance} 
    address={address} 
  />

const UnitQuantity = ({ unit, quantity, onChange }) =>
  <div className="flex space-x-1 items-center">
    <input
      style={{ width: chWidth(quantity) }}
      className="
        h-[1.75em]
        border-2 border-neutral-800 rounded-l-sm
        bg-neutral-300
        text-center outline-none"
      value={quantity ?? ""} 
      onChange={onChange}
    />
    <div 
      className=" 
         text-neutral-800
        cursor-default
        pr-1 text-sm"
    >{unit}</div>
  </div>

export function MeasureInstance({ Context, address }) {
  const [store, dispatch] = useContext(Context)
  const typeInstance = Context.getField(address)(store)

  const activeUnits = typeInstance ? getActiveUnits(typeInstance) : []

  return (
    <>
      {activeUnits?.map(unit =>
        <UnitQuantity
          key={unit}
          quantity={getQuantity(unit)(typeInstance)} 
          unit={unit} 
          onChange={e =>
            regex.float.test(e.target.value)
            ? dispatch({
                type: 'input',
                payload: {
                  address,
                  value: setQuantity(unit)(e.target.value)(typeInstance)
                }
              })
            : null} 
          />)}
    </>
  )
}