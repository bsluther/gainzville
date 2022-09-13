import { join, map, pipe } from "ramda"

export const MassTemplate = {
  id: "typ-t-p-measure-mass",
  type: "TypeTemplate",
  name: "mass",
  aliases: ["weight"],
  typeConstructor: "primitive",
}

export const initializeMassInstance = () => ({
  type: "TypeInstance",
  template: "typ-t-p-measure-mass",
  value: {
    lb: "0"
  }
})

export const massToString = instance => template =>
  pipe(
    Object.entries,
    map(([unit, magnitude]) => `${magnitude} ${unit}`),
    join(" ")
  )(instance.value)