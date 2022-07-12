import { useQueries } from "react-query"

const fetchActivityInstance = ({ queryKey }) =>
  fetch(`/api/activity/instance/${queryKey[2]}`).then(res => res.json())

export const useActivityInstances = ids => {
  const queries = useQueries(ids.map(id => ({
    queryKey: ["activity", "instance", id],
    queryFn: fetchActivityInstance
  })))

  return queries
}