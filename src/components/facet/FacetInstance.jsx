import { useFacetTemplate } from "../../hooks/useFacetTemplate"
import { snakeToSpace } from "../../utility/fns"
import { TypeInstance } from "../type/TypeInstance"


export function FacetInstance({ facetTemplateId, address }) {
  const facetTemplateQuery = useFacetTemplate(facetTemplateId, { 
    enabled: !!facetTemplateId
  })

  return (
    <div className="
      flex items-center
      border-2 border-neutral-800 rounded-lg
      px-2 py-1 space-x-3
      w-max
    ">
      {facetTemplateQuery.isSuccess && (
        <>
          <span className="capitalize">{snakeToSpace(facetTemplateQuery.data.name)}</span>
          {facetTemplateQuery.data.fields.map((typeId, ix) => 
            <TypeInstance key={`${ix}-${typeId}`} typeTemplateId={typeId} address={{ ...address, field: ix }} />)}
        </>
        
      )}
    </div>
  )
}