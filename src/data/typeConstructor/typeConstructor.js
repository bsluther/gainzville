import { makePowerset } from "./powersetConstructor"
import { makeSet } from "./setConstructor"

const constructorTable = {
  "typ-c-set": makeSet,
  "typ-c-powerset": makePowerset
}

const lookupConstructor = id =>
  constructorTable[id]

const constructorNameTable = {
  "typ-c-set": "set",
  "typ-c-powerset": "powerset"
}
  
const lookupConstructorName = id =>
  constructorNameTable[id]

export const constructType = ({ constructorId, createdBy }) => {
  if (!constructorId || !createdBy) {
    throw new Error(`Missing parameters from type constructor`)
  }

  const constructor = lookupConstructor(constructorId)

  if (!constructor) {
    throw new Error(`Unrecognized type constructor id`)
  }

  if (!createdBy) {
    throw new Error(`constructType requires the "createdBy" parameter`)
  }

  else {
    return constructor({
      name: `New ${lookupConstructorName(constructorId)}`,
      elements: [],
      createdBy
    })
  }
}