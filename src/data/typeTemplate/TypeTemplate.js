import { initializeBooleanInstance, BooleanTemplate, booleanToString } from "./BooleanTemplate"
import { DatetimeTemplate, datetimeToString, initializeDatetimeInstance } from "./DatetimeTemplate"
import { DurationTemplate, durationToString, initializeDurationInstance } from "./DurationTemplate"
import { FloatTemplate, floatToString, initializeFloatInstance } from "./FloatTemplate"
import { initializeMassInstance, MassTemplate } from "./MassTemplate"
import { initializeLengthInstance, LengthTemplate } from "./LengthTemplate"
import { initializePowersetInstance } from "./PowersetTemplate"
import { initializeSetInstance } from "./SetTemplate"
import { initializeStringInstance, StringTemplate } from "./StringTemplate"


export const isPrimitive = typeTemplate =>
  typeTemplate.typeConstructor === "primitive"

export const isPrimitiveId = id => id.slice(0, 8) === "typ-t-p-"

const initializerHash = {
  "typ-t-p-boolean": initializeBooleanInstance,
  "typ-t-p-datetime": initializeDatetimeInstance,
  "typ-t-p-measure-duration": initializeDurationInstance,
  "typ-t-p-float": initializeFloatInstance,
  "typ-t-p-measure-mass": initializeMassInstance,
  "typ-t-p-measure-length": initializeLengthInstance,
  "typ-c-powerset": initializePowersetInstance,
  "typ-c-set": initializeSetInstance,
  "typ-t-p-string": initializeStringInstance
}



export const initializeTypeInstance = template => {
  return isPrimitive(template)
    ? initializerHash[template.id](template)
    : initializerHash[template.typeConstructor](template)
}
export const primitiveHash = {
  "typ-t-p-boolean": BooleanTemplate,
  "typ-t-p-datetime": DatetimeTemplate,
  "typ-t-p-measure-duration": DurationTemplate,
  "typ-t-p-float": FloatTemplate,
  "typ-t-p-measure-mass": MassTemplate,
  "typ-t-p-measure-length": LengthTemplate,
  "typ-t-p-string": StringTemplate
}

export const primitives = [
  BooleanTemplate,
  DatetimeTemplate,
  DurationTemplate,
  FloatTemplate,
  MassTemplate,
  LengthTemplate,
  StringTemplate
]

export const getPrimitiveTypeTemplate = templateId =>
  primitiveHash[templateId]

export const toStringTable = {
  "typ-t-p-boolean": booleanToString,
  "typ-t-p-datetime": datetimeToString,
  "typ-t-p-measure-duration": durationToString,
  "typ-t-p-float": floatToString
}

export const typeToString = typeInstance => typeTemplate => {

  const typeConstructor = isPrimitive(typeTemplate)
    ? typeTemplate.id
    : typeTemplate.constructor
  const toString = toStringTable[typeConstructor]

  console.log('instance', typeInstance)
  console.log('template', typeTemplate)

  return toString
    ? toString(typeInstance)(typeTemplate)
    : ""
}
