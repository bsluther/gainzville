import { useTypeTemplate, useTypeTemplateV2 } from "../../hooks/type/useTypeTemplate"
import { BooleanInstance } from "./BooleanInstance";
import { DatetimeInstance } from "./DatetimeInstance";
import { FloatInstance } from "./FloatInstance";
import { DurationInstance, LengthInstance, MassInstance } from "./MeasureInstance";
import { SetInstance } from "./SetInstance";
import { StringInstance } from "./StringInstance";
import { PowersetInstance } from "./PowersetInstance"
import { useReducer } from "react";
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

export function TypeInstance({ typeTemplateId, address }) {
  const isPrimitive = isPrimitiveId(typeTemplateId)
  const typeTemplateQ = useTypeTemplate(typeTemplateId, { enabled: !isPrimitive })

  const Component = isPrimitive
    ? primitiveHash[typeTemplateId]
    : typeTemplateQ.isSuccess
      ? constructorHash[typeTemplateQ.data.typeConstructor]
      : LoadingType

  return (
    <Component typeTemplate={typeTemplateQ.data} address={address} />
  )
}

// const DemoContext = createContext()

const demoReducer = (state, action) => {
  switch (action.type) {
    case "input":
      return setField(action.payload.address)(action.payload.value)

    default:
      console.log(`Unrecognized action type: ${action.type}`)
      return state
  }
}

const DemoController = ({ initialValue, children }) => {
  const [store, dispatch] = useReducer(demoReducer, initialValue)

  return (
    <InstanceContext.Provider value={[store, dispatch]}>
      {children}
    </InstanceContext.Provider>
  )
}


export const TypeInstanceDemo = ({ typeTemplate }) => {

  const initialValue = {
    facets: {
      "demo": {
        fields: [initializeTypeInstance(typeTemplate)]
      }
    }
  }

  return (
    <DemoController initialValue={initialValue}>
      <div className="flex">
        <span
          className="capitalize"
        >{typeTemplate.name}</span>
        <TypeInstance 
          typeTemplateId={typeTemplate.id} 
          address={{ facet: "demo", field: 0 }} 
        />
      </div>
    </DemoController>
  )
}