import { BooleanInstance } from "./BooleanInstance"
import { DatetimeInstance } from "./DatetimeInstance"
import { FloatInstance } from "./FloatInstance"
import { DurationInstance, LengthInstance, MassInstance } from "./MeasureInstance"
import { SetInstance } from "./SetInstance"
import { StringInstance } from "./StringInstance"
import { PowersetInstance } from "./PowersetInstance"
import { createContext, useReducer } from "react"
import { initializeTypeInstance, isPrimitiveId } from "../../../data/typeTemplate/TypeTemplate"
import { useTypeTemplate } from "../../../hooks/queries/type/useTypeTemplate"
import { useEffect } from "react"
import { useState } from "react"


const primitiveComponentLookup = {
  "typ-t-p-float": FloatInstance,
  "typ-t-p-measure-mass": MassInstance,
  "typ-t-p-measure-length": LengthInstance,
  "typ-t-p-measure-duration": DurationInstance,
  "typ-t-p-datetime": DatetimeInstance,
  "typ-t-p-string": StringInstance,
  "typ-t-p-boolean": BooleanInstance
}

const constructorComponentLookup = {
  "typ-c-set": SetInstance,
  "typ-c-powerset": PowersetInstance
}

const LoadingType = () => <div>...</div>

export function TypeInstance({ Context, typeTemplateId, address }) {
  const isPrimitive = isPrimitiveId(typeTemplateId)
  const typeTemplateQ = useTypeTemplate(typeTemplateId)

  const Component = isPrimitive
    ? primitiveComponentLookup[typeTemplateId]
    : typeTemplateQ.isSuccess
      ? constructorComponentLookup[typeTemplateQ.data.typeConstructor]
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
    case "initialize":
      return action.payload
    case "input":
      return demoSetField(action.payload.address)(action.payload.value)

    default:
      console.log(`Unrecognized action type: ${action.type}`)
      return state
  }
}

const DemoController = ({ initialValue, children, typeTemplate }) => {
  const [store, dispatch] = useReducer(demoReducer, initialValue)
  const [currentTypeConstructor, setCurrentTypeConstructor] = useState(typeTemplate?.typeConstructor)

  useEffect(() => {
    if (currentTypeConstructor !== typeTemplate?.typeConstructor) {
      console.log("IFING")
      setCurrentTypeConstructor(typeTemplate?.typeConstructor)
      dispatch({
        type: "initialize",
        payload: initializeTypeInstance(typeTemplate)
      })
    }
  }, [currentTypeConstructor, typeTemplate?.typeConstructor, setCurrentTypeConstructor])
  
  return (
    <DemoContext.Provider value={[store, dispatch]}>
      {children}
    </DemoContext.Provider>
  )
}

export const TypeInstanceFromData = ({ Context, typeTemplate, address }) => {
  const isPrimitive = typeTemplate.typeConstructor === "primitive"

  const Component = isPrimitive
    ? primitiveComponentLookup[typeTemplate.id]
    : constructorComponentLookup[typeTemplate.typeConstructor]
   

  return (
    <Component
      Context={Context}
      typeTemplate={typeTemplate}
      address={address} 
    />
)
}


export const TypeInstanceDemo = ({ typeTemplate, typeTemplateId }) => {
  const typeTemplateQ = useTypeTemplate(typeTemplateId, { enabled: !!typeTemplateId })

  if (typeTemplate) return (
    <DemoController initialValue={initializeTypeInstance(typeTemplate)} typeTemplate={typeTemplate}>
      <TypeInstanceFromData
        Context={DemoContext}
        typeTemplate={typeTemplate} 
        address={{}}
      />
    </DemoController>
  )

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