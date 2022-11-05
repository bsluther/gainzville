import { useAuth0 } from "@auth0/auth0-react"
import { identity, map, prop, reduce, union, values } from "ramda"
import { useEffect, useLayoutEffect } from "react"
import { useActivityInstance } from "../../hooks/queries/activity/instance/useActivityInstance"
import { useActivityTemplate } from "../../hooks/queries/activity/template/useActivityTemplate"
import { getInstance, useActivityInstanceReducer } from "../../state/activityInstanceReducer"
import { InstanceContext } from "../../state/activityInstanceReducer"
import { allSucceeded, makeId } from "../../utility/fns"
import { ActivityInstancePresenter } from "./ActivityInstancePresenter"
import { DateTime } from "luxon"
import { useUpdateEntity } from "../../hooks/queries/entity/useUpdateEntity"
import { useRecentFacets } from "../../hooks/useRecentFacets"
import { useEntities } from "../../hooks/queries/entity/useEntities"
import * as L from "partial.lenses"
import { initializeFacetInstance } from "../../data/Facet"


export const ActivityInstanceController = ({ instanceId, Presenter = ActivityInstancePresenter, ...props }) => {
  const instanceQ = useActivityInstance(instanceId)

  const templateQ = useActivityTemplate(
    instanceQ.data?.template,
    { enabled: !!instanceQ.data?.template }
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



export const NewActivityInstanceController = ({ templateId, handleSaveNewInstance = identity, Presenter = ActivityInstancePresenter }) => {
  const { user } = useAuth0()
  const templateQ = useActivityTemplate(templateId)

  const recentFacetIdsQ = useRecentFacets(templateId)
  const recentFacetsQ = useEntities(recentFacetIdsQ.data, { enabled: recentFacetIdsQ.isSuccess })
  const typeTemplateIds = L.foldl(union)
                                 ([])
                                 ([L.children, "data", "fields"])
                                 (recentFacetsQ)

  const typeTemplateQs = useEntities(
    typeTemplateIds, 
    { enabled: allSucceeded(values(recentFacetsQ)) }
  )
  

  // currently a bit hacked in - it's hard to see if the data required for FacetInstance construction has been successfully fetched
  const queriesSucceeded = (typeTemplateIds.length > 0 || (recentFacetIdsQ.isSuccess && recentFacetIdsQ.data.length === 0))
                            && allSucceeded(values(recentFacetsQ)) 
                            && allSucceeded(values(typeTemplateQs))

  const [store, dispatch] = useActivityInstanceReducer()

  useEffect(() => {
    if (queriesSucceeded) {
      const initialInstance = initializeActivityInstance(templateId, user?.sub)

      const withRecentFacets = reduce((instance, fctTmpl) => 
                                        L.set(["facets", fctTmpl.id])
                                             (initializeFacetInstance(fctTmpl)
                                                                     (map(qry => qry.data)
                                                                         (typeTemplateQs)))
                                             (instance))
                                     (initialInstance)
                                     (map(prop('data'))
                                         (values(recentFacetsQ)))

      dispatch({
        type: "initializeNew",
        payload: withRecentFacets
      })
    }
  }, [user?.sub, queriesSucceeded])

  const instanceTemplate = prop("template")
                               (getInstance(store))

  useEffect(() => {
    if (instanceTemplate !== templateId && queriesSucceeded) {
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
  }, [instanceTemplate, user?.sub, templateId, queriesSucceeded])

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