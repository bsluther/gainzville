import { useState } from "react"
import { ActivityInstanceBrowser } from "../../components/activity/ActivityInstanceBrowser"
import { ActivityInstanceController } from "../../components/activity/ActivityInstanceController"
import { LibraryBrowser } from "../../components/library/LibraryBrowser"
import { Route, Routes, useNavigate } from "react-router-dom"
import { TemplateSearch } from "./TemplateSearch"
import { ActivityTemplateController } from "../../components/activity/ActivityTemplateController"
import { TemplateCreate } from "./TemplateCreate"
import { InstanceNew } from "./InstanceNew"
import { FacetTemplateController } from "../../components/facet/FacetTemplateController"
import { ActivityTemplateBrowser } from "../../components/activity/ActivityTemplateBrowser"


export const Record = () => {
  const navigate = useNavigate()
  const [target, setTarget] = useState()

  return (
    <main
      className="w-full h-full flex"
    >
      <div className="h-full w-1/4">
        {/* <ActivityTemplateBrowser /> */}
        <LibraryBrowser
          selectedTemplate={target}
          setSelectedTemplate={id => {
            navigate(`instance-new?templateId=${id}`)
            setTarget(id)
          }}
        />
      </div>
      <div className="h-full w-1/2 flex justify-center items-start p-4">
        <Routes>
          <Route
            path="instance-new"
            element={
              <InstanceNew target={target} setTarget={setTarget} />
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
            element={<TemplateCreate handleSaveNewTemplate={template => setTarget(template.id)} />}
          />
          <Route
            path="template-edit"
            element={<ActivityTemplateController templateId={target} />}
          />
          <Route
            path="facet-template-test"
            element={
              <FacetTemplateController templateId="fct-t-8e97ca24-50dc-4e18-ae69-731e6d2570d6" />}
          />
        </Routes>
          
      </div>
      <div className="h-full w-max">
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