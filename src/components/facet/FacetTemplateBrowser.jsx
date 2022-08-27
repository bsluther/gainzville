import { useState } from "react"
import { useFacetTemplates } from "../../hooks/queries/facet/useFacetTemplates"
import { EntityListbox } from "../EntityListbox"
import { FacetTemplateController } from "./FacetTemplateController"


export const FacetTemplateBrowser = () => {
  const templatesQ = useFacetTemplates()
  const templates = templatesQ.data ?? []
  const [selectedTemplate, setSelectedTemplate] = useState()

  return (
    <div
      className="flex flex-col space-y-4"
    >
      <div
        className="
          flex flex-col items-center
          bg-neutral-550
          border-2 border-neutral-800 rounded-md
          px-1
          w-max
        "
      >
        <span className="w-max">Facet Templates</span>
        <EntityListbox 
          entities={templates}
          selected={selectedTemplate}
          setSelected={setSelectedTemplate}
          // ItemButtons={DeleteIcon}
        />
        <button
          className="w-max bg-neutral-800 rounded-md px-2 text-neutral-400"
          onClick={() => setSelectedTemplate("new")}
        >New</button>
      </div>
      {selectedTemplate &&
        <FacetTemplateController
          templateId={selectedTemplate}
        />}
    </div>
  )
}