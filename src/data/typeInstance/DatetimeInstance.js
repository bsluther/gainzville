import * as L from 'partial.lenses'

export const getISO = L.get(["value", L.valueOr("")])

export const setISO = L.set(["value"])