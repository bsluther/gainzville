import * as L from "partial.lenses"

export const getString = L.get(["value"])

export const setString = L.set(["value"])