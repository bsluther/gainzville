import { useAuth0 } from "@auth0/auth0-react"
import { assoc, identity, ifElse, keys, pipe, reduceWhile, slice, sort, union } from "ramda"
import { after, getCreatedAt } from "../mobile/pages/TimelinePage"
import { useActivityInstances } from "./queries/activity/instance/useActivityInstances"
import { useEntities } from "./queries/entity/useEntities"

// mapQuery :: (a -> b) -> Query(a) -> Query(b)
export const mapQuery = fn => query =>
  query.isSuccess
    ? { ...query, data: fn(query.data) }
    : query


// A quick and dirty utility to see which facets a user utilized on the most the recent instance of a given template.
// Could add a little ad hoc polymorphism: if ActivityTemplateId is undefined, return the most recently used facets generally, regardless of template.

// useRecentFacets :: (ActivityTemplateId, Number) -> Query([FacetId])
export const useRecentFacets = (activityTemplateId, quantity = Infinity) => {
  const { user } = useAuth0()
  
  const actorObj = { actor: user?.sub }
  const queryObj = ifElse(id => !!id)
                         (id => assoc('template')(id)(actorObj))
                         (() => actorObj)
                         (activityTemplateId)
  const activityInstancesQ = useActivityInstances(queryObj, { enabled: !!user?.sub })

  const recentFacetIdsQ = mapQuery(data => {
    return pipe(
      sort(after(getCreatedAt)),
      ifElse(() => !!activityTemplateId)
            (slice(0, 1))
            (identity),
      reduceWhile((acc, inst) => acc.length < quantity)
                 ((acc, inst) => 
                    reduceWhile((acc, fctId) => acc.length < quantity)
                               ((acc, fctId) => union(acc)([fctId]))
                               (acc)
                               (keys(inst.facets)))
                 ([])
    )(data)
  })(activityInstancesQ)
  return recentFacetIdsQ
  // return useEntities(recentFacetIdsQ?.data, { enabled: recentFacetIdsQ.isSuccess })
}