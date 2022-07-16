export const DurationTemplate = {
  id: "typ-t-p-measure-duration",
  type: "TypeTemplate",
  name: "duration",
  aliases: [],
  typeConstructor: "primitive"
}

export const initializeDurationInstance = () => ({
  type: "TypeInstance",
  template: "typ-t-p-measure-duration",
  value: {
    hour: "0",
    minute: "0",
    second: "0"
  }
})