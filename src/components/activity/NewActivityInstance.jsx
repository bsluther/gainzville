import { useActivityTemplate } from "../../hooks/useActivityTemplate"

const initializeActivityInstance = (templateId, user) => {
  const id = makeId("act-i")
  return ({
    _id: id,
    id,
    user,
    template: templateId
  })
}

export const NewActivityInstance = ({ templateId, user }) => {
  const [store, disptach] = useActivityTemplateReducer(initializeActivityInstance(templateId, user))

  return (
    null
  )
}