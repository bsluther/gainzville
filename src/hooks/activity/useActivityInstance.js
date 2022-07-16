import { useQuery } from "react-query"

export const useActivityInstance = id => {
  const query = useQuery(
    ["activity", "instance", id],
    () => fetch(`/api/activity/instance/${id}`).then(res => res.json()),
    {
      enabled: !!id
    }
  )

  return query
}