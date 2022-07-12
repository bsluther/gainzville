import { useTypeTemplate } from "../../hooks/useTypeTemplate"
import { BooleanInstance } from "./BooleanInstance";
import { DatetimeInstance } from "./DatetimeInstance";
import { FloatInstance } from "./FloatInstance";
import { DurationInstance, LengthInstance, MassInstance } from "./MeasureInstance";
import { SetInstance } from "./SetInstance";
import { StringInstance } from "./StringInstance";



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
  "typ-c-set": SetInstance
}

const LoadingType = () => <div>...</div>

export function TypeInstance({ typeTemplateId, address }) {
  const isPrimitive = typeTemplateId.slice(0, 8) === "typ-t-p-"
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