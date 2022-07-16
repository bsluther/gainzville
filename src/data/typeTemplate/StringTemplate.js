export const StringTemplate = {
  id: "typ-t-p-string",
  type: "TypeTemplate",
  name: "string",
  aliases: [],
  typeConstructor: "primitive"
}

export const initializeStringInstance = () => ({
  type: "TypeInstance",
  template: "typ-t-p-string",
  value: ""
})