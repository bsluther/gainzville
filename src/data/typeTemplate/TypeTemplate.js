import { initializeBooleanInstance, BooleanTemplate } from "./BooleanTemplate"
import { DatetimeTemplate, initializeDatetimeInstance } from "./DatetimeTemplate"
import { DurationTemplate, initializeDurationInstance } from "./DurationTemplate"
import { FloatTemplate, initializeFloatInstance } from "./FloatTemplate"
import { initializeMassInstance, MassTemplate } from "./MassTemplate"
import { initializeLengthInstance, LengthTemplate } from "./LengthTemplate"
import { initializePowersetInstance } from "./PowersetTemplate"
import { initializeSetInstance } from "./SetTemplate"
import { initializeStringInstance, StringTemplate } from "./StringTemplate"


export const isPrimitive = typeTemplate =>
  typeTemplate.typeConstructor === "primitive"


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



export const initializeTypeInstance = template =>
  isPrimitive(template)
    ? initializerHash[template.id](template)
    : initializerHash[template.typeConstructor](template)

export const primitiveHash = {
  "typ-t-p-boolean": BooleanTemplate,
  "typ-t-p-datetime": DatetimeTemplate,
  "typ-t-p-measure-duration": DurationTemplate,
  "typ-t-p-float": FloatTemplate,
  "typ-t-p-measure-mass": MassTemplate,
  "typ-t-p-measure-length": LengthTemplate,
  "typ-t-p-string": StringTemplate
}

export const getPrimitiveTypeTemplate = templateId =>
  primitiveHash[templateId]