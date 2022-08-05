import * as L from 'partial.lenses'
import { dissoc } from 'ramda'

// setFieldValue :: Address -> TypeInstance -> ActivityInstance -> ActivityInstance
export const setField = ({ facet, field }) =>
  L.set(['facets', facet, 'fields', field])

// This is cheating right now, it shouldn't know about instance
// getFieldValue :: Address -> ActivityInstance -> TypeInstance
export const getField = ({ facet, field }) =>
  L.get(['instance', 'facets', facet, 'fields', field])

export const removeFacet = facetId =>
  L.modify(['facets'])(dissoc(facetId))