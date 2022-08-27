import { useEffect } from "react"
import { useFacetTemplate } from "../../hooks/facet/useFacetTemplate"
import { FacetTemplateContext, useFacetTemplateReducer } from "../../state/facetTemplateReducer"
import * as FacetTemplate from "../../data/FacetTemplate"
import { FacetTemplatePresenter } from "./FacetTemplatePresenter"
import { useInsertFacetTemplate } from "../../hooks/facet/useInsertFacetTemplate"
import { useAuth0 } from "@auth0/auth0-react"

export const FacetTemplateController = ({ templateId, Presenter = FacetTemplatePresenter }) => {
  const { user } = useAuth0()
  const templateQ = useFacetTemplate(templateId, { enabled: templateId !== "new"})
  const [store, dispatch] = useFacetTemplateReducer()
  const insertM = useInsertFacetTemplate(user?.sub)

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
          handleSave={template => insertM.mutate(template)}
          Context={FacetTemplateContext}
        />}
    </FacetTemplateContext.Provider>
  )
}