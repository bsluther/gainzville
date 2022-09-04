import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { NewActivityInstanceController } from "../../components/activity/ActivityInstanceController"
import { useInsertActivityInstance } from "../../hooks/queries/activity/instance/useInsertActivityInstance"


export const InstanceNew = ({ target, setTarget }) => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const insertInstanceM = useInsertActivityInstance()


  return (
    <NewActivityInstanceController
      templateId={searchParams.get('templateId')}
      handleSaveNewInstance={instance => {
        navigate("instance-edit")
        setTarget(instance.id)
        insertInstanceM.mutate(instance)
      }}
    />
  )
}