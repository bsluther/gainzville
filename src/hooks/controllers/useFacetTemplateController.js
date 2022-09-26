import { useAuth0 } from "@auth0/auth0-react"
import { identity } from "ramda"
import { useEffect } from "react"
import { useFacetTemplateReducer } from "../../state/facetTemplateReducer"
import { useEntity } from "../queries/entity/useEntity"
import * as FacetTemplate from "../../data/FacetTemplate"
import { useInsertEntity } from "../queries/entity/useInsertEntity"



export const useFacetTemplateController = templateId => {
  const { user } = useAuth0()
  const templateQ = useEntity(templateId, { enabled: templateId !== "DRAFT" })
  const insertM = useInsertEntity()

  const [store, dispatch] = useFacetTemplateReducer()

  const handleSave = templateId === "DRAFT"
    ? insertM.mutate
    : identity

  useEffect(() => {
    if (templateQ.isSuccess) {
      if (!store) {
        dispatch({ type: "initialize", payload: templateQ.data })
      }
      if (!!store && templateId !== store?.template.id) {
        dispatch({ type: "initialize", payload: templateQ.data })
      }
    }

    if (templateId === "DRAFT") {
      if (!store || !store.isDraft) {
        dispatch({ type: "initializeDraft", payload: FacetTemplate.newTemplate(user?.sub) })
      }
    }
  }, [!store, !!store, !store?.isDraft, store?.template.id, templateQ.data, templateQ.isSuccess, templateId])

  return ({
    store,
    dispatch,
    handleSave
  })
}