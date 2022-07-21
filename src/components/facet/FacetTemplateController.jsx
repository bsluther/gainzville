import { useEffect } from "react"
import { useFacetTemplate } from "../../hooks/facet/useFacetTemplate"
import { FacetTemplateContext, useFacetTemplateReducer } from "../../state/facetTemplateReducer"
import * as FacetTemplate from "../../data/FacetTemplate"
import { FacetTemplatePresenter } from "./FacetTemplatePresenter"

export const FacetTemplateController = ({ templateId }) => {
  const templateQ = useFacetTemplate(templateId, { enabled: templateId !== "new"})
  const [store, dispatch] = useFacetTemplateReducer()

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
          payload: FacetTemplate.newTemplate("dev2")
        })
      }
    }
    
  }, [store, templateQ.isSuccess, templateId])

  return (
    <FacetTemplateContext.Provider value={[store, dispatch]}>
      {store &&
        <FacetTemplatePresenter />}
    </FacetTemplateContext.Provider>
  )
}