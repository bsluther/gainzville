import { useTypeTemplate, useTypeTemplateV2 } from "../../hooks/type/useTypeTemplate"
import { BooleanInstance } from "./BooleanInstance";
import { DatetimeInstance } from "./DatetimeInstance";
import { FloatInstance } from "./FloatInstance";
import { DurationInstance, LengthInstance, MassInstance } from "./MeasureInstance";
import { SetInstance } from "./SetInstance";
import { StringInstance } from "./StringInstance";
import { PowersetInstance } from "./PowersetInstance"
import { createContext, useReducer } from "react";
import { initializeTypeInstance, isPrimitiveId } from "../../data/typeTemplate/TypeTemplate";
import { InstanceContext } from "../../state/activityInstanceReducer";
import * as L from "partial.lenses"
import { setField } from "../../data/ActivityInstance";


const primitiveHash = {
  "typ-t-p-float": FloatInstance,
  "typ-t-p-measure-mass": MassInstance,
  "typ-t-p-measure-length": LengthInstance,
  "typ-t-p-measure-duration": DurationInstance,
  "typ-t-p-datetime": DatetimeInstance,
  "typ-t-p-string": StringInstance,
  "typ-t-p-boolean": BooleanInstance
}

const constructorHash = {
  "typ-c-set": SetInstance,
  "typ-c-powerset": PowersetInstance
}

const LoadingType = () => <div>...</div>

export function TypeInstance({ Context, typeTemplateId, address }) {
  const isPrimitive = isPrimitiveId(typeTemplateId)
  const typeTemplateQ = useTypeTemplate(typeTemplateId, { enabled: !isPrimitive })

  const Component = isPrimitive
    ? primitiveHash[typeTemplateId]
    : typeTemplateQ.isSuccess
      ? constructorHash[typeTemplateQ.data.typeConstructor]
      : LoadingType

  return (
    <Component
      Context={Context}
      typeTemplate={typeTemplateQ.data}
      address={address} 
    />
  )
}



/***** TYPE INSTANCE DEMO *****/

const demoGetField = address => state => state
const demoSetField = address => typeInstance => typeInstance

export const DemoContext = createContext()
DemoContext.getField = demoGetField

const demoReducer = (state, action) => {
  switch (action.type) {
    case "input":
      return demoSetField(action.payload.address)(action.payload.value)

    default:
      console.log(`Unrecognized action type: ${action.type}`)
      return state
  }
}

const DemoController = ({ initialValue, children }) => {
  const [store, dispatch] = useReducer(demoReducer, initialValue)
  
  return (
    <DemoContext.Provider value={[store, dispatch]}>
      {children}
    </DemoContext.Provider>
  )
}


export const TypeInstanceDemo = ({ typeTemplateId }) => {
  const typeTemplateQ = useTypeTemplateV2(typeTemplateId)

  return (
    <>
      {typeTemplateQ.isSuccess && 
        <DemoController initialValue={initializeTypeInstance(typeTemplateQ.data)}>
          <TypeInstance
            Context={DemoContext}
            typeTemplateId={typeTemplateId} 
            address={{}} 
          />
        </DemoController>}
    </>
  )
}