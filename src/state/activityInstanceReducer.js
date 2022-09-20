import { pipe } from "ramda";
import { createContext, useReducer } from "react";
import * as L from "partial.lenses";
import { getField, removeFacet, setField } from "../data/ActivityInstance";
import { initializeTypeInstance } from "../data/typeTemplate/TypeTemplate";

export const InstanceContext = createContext();
// Note that getField is cheating right now, it's looking inside instance, need to have this module handle that, and the data structure only handle things "inside" the data structure
InstanceContext.getField = getField

const setAsChanged = L.set(["hasChanged"], true)
const setAsUnchanged = L.set(["hasChanged"], false)
const setAsUnpersisted = L.set(["isUnpersisted"], true)
export const getInstance = L.get(["instance"])
export const setInstance = L.set(["instance"])
export const modifyInstance = L.modify(["instance"])



const reducer = (state, action) => {
  // console.log("Action: ", action)
  // console.log("State: ", state)
  switch (action.type) {
    case "initialize":
      return pipe(
        setInstance(action.payload),
        setAsUnchanged,
      )(state);

    case "initializeNew":
      return pipe(
        setInstance(action.payload),
        setAsUnpersisted
      )(state)

    case "clearData":
      return ({});
      
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
      console.log("unrecognized action: ", action);
      return state;
  }
};



export const useActivityInstanceReducer = initialState => useReducer(reducer, initialState);
