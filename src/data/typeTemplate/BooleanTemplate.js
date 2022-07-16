export const BooleanTemplate = {
  id: "typ-t-p-boolean",
  type: "TypeTemplate",
  name: "boolean",
  aliases: [],
  typeConstructor: "primitive"
}

export const initializeBooleanInstance = () => ({
  type: "TypeInstance",
  template: "typ-t-p-boolean",
  value: false
})