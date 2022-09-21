import { useAuth0 } from "@auth0/auth0-react"
import { identity, keys, map, prop, reduce, union, values } from "ramda"
import { useEffect, useLayoutEffect } from "react"
import { useActivityInstance } from "../../hooks/queries/activity/instance/useActivityInstance"
import { useActivityTemplate } from "../../hooks/queries/activity/template/useActivityTemplate"
import { useUpdateActivityInstance } from "../../hooks/queries/activity/instance/useUpdateActivityInstance"
import { getInstance, useActivityInstanceReducer } from "../../state/activityInstanceReducer"
import { InstanceContext } from "../../state/activityInstanceReducer"
import { allSucceeded, makeId } from "../../utility/fns"
import { ActivityInstancePresenter } from "./ActivityInstancePresenter"
import { DateTime } from "luxon"
import { useUpdateEntity } from "../../hooks/queries/entity/useUpdateEntity"
import { useInsertEntity } from "../../hooks/queries/entity/useInsertEntity"
import { mapQuery, useRecentFacets } from "../../hooks/useRecentFacets"
import { useEntities } from "../../hooks/queries/entity/useEntities"
import * as L from "partial.lenses"
import { initializeFacetInstance } from "../../data/Facet"


export const ActivityInstanceController = ({ instanceId, Presenter = ActivityInstancePresenter, ...props }) => {
  const instanceQ = useActivityInstance(instanceId)
  const templateQ = useActivityTemplate(
    instanceQ.data?.template,
    { enabled: !!instanceQ.data }
  )
  const updateM = useUpdateEntity({ onSuccess: (_, instance) => dispatch({ type: "persisted", payload: instance })})

  const [store, dispatch] = useActivityInstanceReducer()

  const handleSave = instance => {
    updateM.mutate(instance)
  }

  useLayoutEffect(() => {
    if (instanceQ.isSuccess) {
      if (!store?.instance) {
        dispatch({
          type: "initialize",
          payload: instanceQ.data
        })
      }
      if (store?.id !== instanceId) {
        dispatch({
          type: "initialize",
          payload: instanceQ.data
        })
      }
    }
  }, [instanceId, instanceQ.isSuccess, instanceQ.data, store?.id, !store])


  return (
    <InstanceContext.Provider value={[store, dispatch]}>
      {templateQ.isSuccess && store &&
        <Presenter 
          Context={InstanceContext}
          template={templateQ.data}
          handleSaveChanges={handleSave}
          updateMutation={updateM}
          {...props}
        />}
    </InstanceContext.Provider>
  )
}

const initializeActivityInstance = (templateId, actor) => {
  const id = makeId("act-i")
  return ({
      _id: id,
      id,
      createdAt: DateTime.now().toISO(),
      actor,
      template: templateId,
      facets: {}
    })
}

// ??? :: Facet -> ({}) FacetInstance



export const NewActivityInstanceController = ({ templateId, handleSaveNewInstance = identity, Presenter = ActivityInstancePresenter }) => {
  const { user } = useAuth0()
  const templateQ = useActivityTemplate(templateId)

  const recentFacetsQ = useRecentFacets(templateId)

  const typeTemplateIds = L.foldl(union)
                                 ([])
                                 ([L.children, "data", "fields"])
                                 (recentFacetsQ)

  const typeTemplateQs = useEntities(
    typeTemplateIds, 
    { enabled: allSucceeded(values(recentFacetsQ)) }
  )
  console.log('typeTemplateQs', typeTemplateQs)

  const typeQsSucceeded = allSucceeded(values(typeTemplateQs)) 

  const [store, dispatch] = useActivityInstanceReducer()
  // console.log(store)

  useEffect(() => {
    if (typeQsSucceeded) {
      const initialInstance = initializeActivityInstance(templateId, user?.sub)

      const withRecentFacets = reduce((instance, fctTmpl) => {
        return L.set(["facets", fctTmpl.id])
                    (initializeFacetInstance(fctTmpl)
                                            (map(qry => qry.data)(typeTemplateQs)))
                    (instance)
      })
                                     (initialInstance)
                                     (map(prop('data'))(values(recentFacetsQ)))

      dispatch({
        type: "initializeNew",
        payload: withRecentFacets
      })
    }
  }, [user?.sub, typeQsSucceeded])

  const instanceTemplate = prop("template")
                               (getInstance(store))

  useEffect(() => {
    if (instanceTemplate !== templateId && typeQsSucceeded) {
      const initialInstance = initializeActivityInstance(templateId, user?.sub)

      const withRecentFacets = reduce((instance, fctTmpl) => {
        return L.set(["facets", fctTmpl.id])
                    (initializeFacetInstance(fctTmpl)
                                            (map(qry => qry.data)(typeTemplateQs)))
                    (instance)
      })
                                     (initialInstance)
                                     (map(prop('data'))(values(recentFacetsQ)))

      dispatch({
        type: "initializeNew",
        payload: withRecentFacets
      })
    }
  }, [instanceTemplate, user?.sub, templateId])

  return (
    <InstanceContext.Provider value={[store, dispatch]}>
      {(templateQ.isSuccess && store) && 
        <Presenter
          Context={InstanceContext}
          template={templateQ.data}
          handleSaveChanges={instance => {
            dispatch({ type: "clearData" })
            handleSaveNewInstance(instance)
          }}
        />}
    </InstanceContext.Provider>
  )
}