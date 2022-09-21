import { useAuth0 } from "@auth0/auth0-react"
import { identity, ifElse, keys, map, pipe, reduceWhile, slice, sort, union } from "ramda"
import { useQuery } from "react-query"
import { after, getCreatedAt } from "../mobile/pages/TimelinePage"
import { fetchWithError } from "../utility/fns"
import { useActivityInstances } from "./queries/activity/instance/useActivityInstances"
import { useEntities } from "./queries/entity/useEntities"

export const mapQuery = fn => query =>
query.isSuccess
? { ...query, data: fn(query.data) }
: query

// useRecentFacets :: (ActivityTemplateId, QueryOptions) -> Query([Facet])

// A quick and dirty utility to see which facets a user utilized on the most the recent instance of a given template.
// Could add a little ad hoc polymorphism: if ActivityTemplateId is undefined, return the most recently used facets generally, regardless of template.

export const useRecentFacets = (activityTemplateId, options) => {
  const { user } = useAuth0()
  const QUANTITY = 5
  
  const activityInstancesQ = useActivityInstances({
    actor: user?.sub,
    template: activityTemplateId
  }, { 
    enabled: !!user?.sub 
  })

  const recentFacetIdsQ = mapQuery(data => {
    return pipe(
      sort(after(getCreatedAt)),
      ifElse(() => !!activityTemplateId)
            (slice(0, 1))
            (identity),
      reduceWhile((acc, inst) => acc.length < QUANTITY)
                 ((acc, inst) => 
                    reduceWhile((acc, fctId) => acc.length < QUANTITY)
                               ((acc, fctId) => union(acc)([fctId]))
                               (acc)
                               (keys(inst.facets)))
                 ([])
    )(data)
  })(activityInstancesQ)

  return useEntities(recentFacetIdsQ?.data, { enabled: recentFacetIdsQ.isSuccess })
}