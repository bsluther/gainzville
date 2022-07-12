import * as L from 'partial.lenses'

// Should "a" be a TypeInstance? Probably.
// setFieldValue :: FacetId -> Nat -> a -> ActivityInstance -> ActivityInstance
export const setField = facetId => fieldIx =>
  L.set(['facets', facetId, 'fields', fieldIx])

// Should "a" be a TypeInstance? Probably.
// getFieldValue :: FacetId -> Nat -> ActivityInstance -> a
export const getField = ({ facet, field }) =>
  L.get(['facets', facet, 'fields', field])