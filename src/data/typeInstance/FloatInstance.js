import * as L from 'partial.lenses'

export const toString = L.get(['value'])

export const fromString = L.set(['value'])