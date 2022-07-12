import { useReducer } from "react"

const reducer = (state, action) => {

}

const useController = (initialState, query, mutation) => {
  const [store, dispatch] = useReducer(reducer, initialState)
}