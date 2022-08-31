import { useEffect } from "react"
import { FacetTemplateContext, useFacetTemplateReducer } from "../../state/facetTemplateReducer"
import * as FacetTemplate from "../../data/FacetTemplate"
import { FacetTemplatePresenter } from "./FacetTemplatePresenter"
import { useAuth0 } from "@auth0/auth0-react"
import { useInsertFacetTemplate } from "../../hooks/facet/useInsertFacetTemplate"
import { useEntity } from "../../hooks/queries/entity/useEntity"
import { useInsertEntity } from "../../hooks/queries/entity/useInsertEntity"

export const FacetTemplateController = ({ templateId, Presenter = FacetTemplatePresenter, handleSave, ...props }) => {
  const { user } = useAuth0()
  const templateQ = useEntity(templateId, { enabled: templateId !== "new"})
  const [store, dispatch] = useFacetTemplateReducer()
  const insertM = useInsertFacetTemplate(user?.sub)
  const insertM_ = useInsertEntity()

  useEffect(() => {
    if (templateQ.isSuccess) {
      if (!store) {
        dispatch({
          type: "initialize",
          payload: templateQ.data
        })
      }
      if (store && templateId !== store?.template.id) {
        dispatch({
          type: "initialize",
          payload: templateQ.data
        })
      }
    }

    if (templateId === "new") {
      if (!store || !store.isNew) {
        dispatch({
          type: "initializeNew",
          payload: FacetTemplate.newTemplate(user?.sub)
        })
      }
    }
    
  }, [store, templateQ.isSuccess, templateId])

  return (
    <FacetTemplateContext.Provider value={[store, dispatch]}>
      {store &&
        <Presenter
          handleSave={(facetTemplate, typeTemplates) => {
            insertM_.mutate(facetTemplate)
            handleSave(facetTemplate, typeTemplates)
          }}
          Context={FacetTemplateContext}
          {...props}
        />}
    </FacetTemplateContext.Provider>
  )
}