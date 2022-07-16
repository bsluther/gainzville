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