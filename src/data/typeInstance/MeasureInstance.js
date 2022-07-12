import * as L from 'partial.lenses'

export const getQuantity = unit =>
  L.get(['value', unit])

export const setQuantity = unit =>
  L.set(['value', unit])

export const getActiveUnits = measureInstance =>
  measureInstance
  ? Object.keys(measureInstance.value)
  : []