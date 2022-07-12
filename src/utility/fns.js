import { v4 as uuid } from 'uuid'

export const chWidth = str => `${str?.length > 2 ? str.length + 1 : 3}ch`

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
    ? str.replace("_", " ")
    : str