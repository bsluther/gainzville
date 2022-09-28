export const LengthTemplate = {
  id: "typ-t-p-measure-length",
  type: "TypeTemplate",
  name: "length",
  aliases: [],
  typeConstructor: "primitive"
}

export const initializeLengthInstance = () => ({
  type: "TypeInstance",
  template: "typ-t-p-measure-length",
  value: {
    mi: "0",
    mm: "0"
  }
})