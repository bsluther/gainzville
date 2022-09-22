import { useAuth0 } from "@auth0/auth0-react"
import { pipe, reduceWhile, sort, union } from "ramda"
import { after, getCreatedAt } from "../../../mobile/pages/TimelinePage"
import { mapQuery } from "../../../utility/fns"
import { useActivityInstances } from "./instance/useActivityInstances"

export const useRecentActivities = (quantity = Infinity) => {
  const { user, isAuthenticated } = useAuth0()

  const instancesQ = useActivityInstances({ actor: user?.sub }, { enabled: isAuthenticated })

  return mapQuery(
    pipe(
      sort(after(getCreatedAt)),
      reduceWhile(acc => acc.length < quantity)
                 ((acc, inst) => union(acc)([inst.template]))
                 ([])
    )
  )(instancesQ)
}