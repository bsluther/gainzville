import { useQuery } from "react-query"

const useFacetTemplate = (id, options) => {
  const facetTemplateQuery = useQuery(
    ["facet", "template", id],
    () => fetch(`/api/facet/template/${id}`)
          .then(res => res.json()),
    options
  )

  return facetTemplateQuery
}
