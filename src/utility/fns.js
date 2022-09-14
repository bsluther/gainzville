import { append, ifElse, prop, reduce, slice } from 'ramda'
import { v4 as uuid } from 'uuid'

export const chWidth = (str, padding = 0) =>
  `${str?.length > 2
      ? str.length + 1 + padding
      : 3 + padding}ch`

export const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
}

export const makeId = prefix => `${prefix}-${uuid()}`

export const snakeToSpace = str => 
  typeof str === "string"
    ? str.replace(/_/g, " ")
    : str

export async function fetchWithError(url, options) {
  const response = await fetch(url, options);

  if (response.status === 200) {
    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  }

  throw new Error (`Error ${response.status}: ${response.statusText}`);
}

const idTypeTable = {
  "act-t": "ActivityTemplate",
  "act-i": "ActivityInstance",
  "fct-t": "FacetTemplate",
  "lib": "Library",
  "typ-c": "TypeConstructor",
  "typ-t": "TypeTemplate",
  "typ-t-p": "TypeTemplate/Primitive"
}

const lookupIdType = prefix => idTypeTable[prefix] ?? undefined

export const typeofId = str => {
  if (!str || typeof str !== "string") {
    return undefined
  }
  if (str.length <= 37) {
    // This is a little hacked in rn, handling the type template primitive case
    return lookupIdType(str.slice(0, 7))
  }
  return lookupIdType(slice(0)(-37)(str))
}

const typeQueryKeyTable = {
  ActivityTemplate: ["activity", "templates"],
  ActivityInstance: ["activity", "instances"],
  FacetTemplate: ["facet", "templates"],
  Library: ["libraries"],
  TypeConstructor: ["type", "constructors"],
  TypeTemplate: ["type", "templates"],
  "TypeTemplate/Primitive": ["type", "templates"]
}

export const lookupTypeQueryKey = type => typeQueryKeyTable[type]

export const callIfFn = a => (...args) => {
  if (typeof a === "function") {
    return a(args)
  }
}


export const allSucceeded = reduce((acc, qry) => acc && qry.isSuccess)
                                  (true)
