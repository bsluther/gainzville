import { pipe, remove } from "ramda";
import * as L from "partial.lenses";
import { useReducer } from "react";

export const templateLens = ["template"];
const nameLens = [...templateLens, "name"];
const elementsLens = [...templateLens, "elements"];
const constructorLens = [...templateLens, "typeConstructor"];

const typeTemplateReducer = (state, action) => {
  // console.log("Action:", action)
  switch (action.type) {
    case "initialize":
      return pipe(
        L.set(templateLens, action.payload.template)
      )(state);

    case "setName":
      return pipe(
        L.set(nameLens, action.payload)
      )(state);

    case "setConstructor":
      return pipe(
        L.set(constructorLens, action.payload)
      )(state);

    case "appendElement":
      return pipe(
        L.modify(elementsLens)(els => els.includes(action.payload)
          ? els
          : els.concat(action.payload))
      )(state);

    case "removeElement":
      return pipe(
        L.modify(elementsLens, remove(action.payload, 1))
      )(state);

    case "updateElement":
      return pipe(
        L.set([...elementsLens, action.payload.index], action.payload.element)
      )(state);

    default:
      console.log("Unrecognized typeTemplate action: ", action);
      return state;
  }
};
export const useTypeTemplateReducer = initialState => useReducer(typeTemplateReducer, initialState);
