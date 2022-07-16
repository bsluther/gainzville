import { pipe } from "ramda";
import { createContext, useReducer } from "react";
import * as L from "partial.lenses";
import { removeFacet, setField } from "../data/ActivityInstance";
import { initializeTypeInstance } from "../data/typeTemplate/TypeTemplate";

const setAsChanged = L.set(["hasChanged"], true)
const setAsUnchanged = L.set(["hasChanged"], false)

export const reducer = (state, action) => {
  switch (action.type) {
    case "initialize":
      return pipe(
        setInstance(action.payload),
        setAsUnchanged
      )(state);
      
    case "input":
      return pipe(
        L.modify(["instance"], setField(action.payload.address)(action.payload.value)),
        setAsChanged
      )(state);

    case "addFacet":
      if (Object.keys(state.instance.facets).includes(action.payload)) {
        return state
      }

      return pipe(
        L.set(["instance", "facets", action.payload.facetTemplate.id])
             ({
                fields: action.payload.typeTemplates.map(typeTemplate => initializeTypeInstance(typeTemplate))
              }),
        setAsChanged
      )(state)

    case "removeFacet":
      return pipe(
        modifyInstance(removeFacet(action.payload)),
        setAsChanged
      )(state)

    default:
      console.log(action);
      return state;
  }
};

export const getInstance = L.get(["instance"]);
export const setInstance = L.set(["instance"]);
export const modifyInstance = L.modify(["instance"])

export const InstanceContext = createContext();

export const useActivityInstanceReducer = initialState => useReducer(reducer, initialState);
