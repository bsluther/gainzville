import { useState } from "react"
import { ActivityInstanceBrowser } from "../../components/activity/ActivityInstanceBrowser"
import { ActivityInstanceController, NewActivityInstanceController } from "../../components/activity/ActivityInstanceController"
import { LibraryBrowser } from "../../components/library/LibraryBrowser"
import { useInsertActivityInstance } from "../../hooks/queries/activity/instance/useInsertActivityInstance"
import { Route, Routes, useNavigate } from "react-router-dom"
import { TemplateSearch } from "./TemplateSearch"
import { ActivityTemplateController } from "../../components/activity/ActivityTemplateController"
import { TemplateCreate } from "./TemplateCreate"


export const Record = () => {
  const insertInstanceM = useInsertActivityInstance()
  const navigate = useNavigate()
  const [target, setTarget] = useState()

  return (
    <main
      className="w-full h-full flex"
    >
      <div className="h-full w-1/4">
        <LibraryBrowser
          selectedTemplate={target}
          setSelectedTemplate={id => {
            navigate("instance-new")
            setTarget(id)
          }}
        />
      </div>
      <div className="h-full w-1/2 flex justify-center items-start p-4">
        <Routes>
          <Route
            path="instance-new"
            element={
              <NewActivityInstanceController
                  templateId={target}
                  handleSaveNewInstance={instance => {
                    navigate("instance-edit")
                    setTarget(instance.id)
                    insertInstanceM.mutate(instance)
                  }}
                />
            }
          />
          <Route
            path="instance-edit"
            element={
              <ActivityInstanceController instanceId={target} />
            }
          />
          <Route
            path="template-search"
            element={<TemplateSearch />}
          />
          <Route
            path="template-create"
            element={<TemplateCreate />}
          />
          <Route
            path="template-edit"
            element={<ActivityTemplateController templateId={target} />}
          />
        </Routes>
          
      </div>
      <div className="h-full w-1/4">
        <ActivityInstanceBrowser
          selectedInstance={target}
          setSelectedInstance={id => {
            navigate("instance-edit")
            setTarget(id)
          }}
        />
      </div>
    </main>
  )
}



const Button = props =>
  <button
    {...props}
    className="w-max h-max px-2 py-1 bg-neutral-300 text-neutral-800 rounded-md"
  >
    {props.children}
  </button>