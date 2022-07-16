import { DateTime } from "luxon"

export const DatetimeTemplate = {
  id: "typ-t-p-datetime",
  type: "TypeTemplate",
  name: "datetime",
  aliases: [],
  typeConstructor: "primitive"
}

export const initializeDatetimeInstance = () => ({
  type: "TypeInstance",
  template: "typ-t-p-datetime",
  value: DateTime.now().toISO()
})