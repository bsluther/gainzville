import { useAuth0 } from "@auth0/auth0-react"
import { identity } from "ramda"
import { useEffect } from "react"
import { useActivityTemplateReducer } from "../../state/activityTemplateReducer"
import * as ActivityTemplate from "../../data/ActivityTemplate"

export const useActivityTemplateController = templateId => {
  const { user, isAuthenticated } = useAuth0()
  const templateQ = useEntity(templateId, { enabled: templateId !== "DRAFT" })

  const [store, dispatch] = useActivityTemplateReducer()

  useEffect(() => {
    if (templateQ.isSuccess) {
      if (!store) {
        dispatch({ type: "initialize", payload: templateQ.data })
      }

      if (store && templateId !== store?.template.id) {
        dispatch({ type: "initialize", payload: templateQ.data })
      }
    }
  }, [store, store?.template.id, templateId, templateQ.isSuccess])

  useEffect(() => {
    // NEED TO CHECK THAT THERE'S IS AN AUTHENTICATED USER BEFORE ALLOWING NEW TEMPLATE CREATION
    if (templateId === "DRAFT") {
      if (!store || !store.isDraft) {
        dispatch({ type: "initializeNew", payload: ActivityTemplate.newTemplate(user?.sub) })
      }
    }

  }, [templateId === "DRAFT", !store, !store.isDraft, user?.sub])

  const handleSave = identity

  return ({
    store,
    dispatch,
    handleSave
  })
}