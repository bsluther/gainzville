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

// export async function fetchWithAuth

// export const throwUnauthorized = getAccessTokenSilently => {
//   const tokenResponse = await getAccessTokenSilently()

  
// }

// export async function fetchWithToken()