export const FloatTemplate = {
  id: "typ-t-p-float",
  type: "TypeTemplate",
  name: "float",
  aliases: ["real", "real_number", "decimal_number"],
  typeConstructor: "primitive"
}

export const initializeFloatInstance = () => ({
  type: "TypeInstance",
  template: "typ-t-p-float",
  value: "0"
})

export const floatInstanceOf = value => ({
  type: "TypeInstance",
  template: "typ-t-p-float",
  value: value
})

export const floatToString = instance => template =>
  `${instance.value}`