import { useState } from "react"
import { useActivityTemplates } from "../../hooks/activity/useActivityTemplates"
import { XSVG } from "../../svg/XSvg"
import { EntityListbox } from "../EntityListbox"
import { ActivityTemplateController } from "./ActivityTemplateController"
import { useDeleteActivityTemplate } from "../../hooks/activity/useDeleteActivityTemplate"
import { TrashSVG } from "../../svg/TrashSVG"


export const ActivityTemplateBrowser = () => {
  const templatesQ = useActivityTemplates()
  const templates = templatesQ.data ?? []
  const [selectedTemplate, setSelectedTemplate] = useState()
  const deleteM = useDeleteActivityTemplate()


  const DeleteIcon = ({ id, className }) => {
    return (
      <TrashSVG
        className={`
          h-5 w-5 hover:text-red-600
          ${className}
        `}
        onClick={() => {
          deleteM.mutate(id)
        }}
      />
    )
  }


  return(
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
        <span className="w-max">Activity Templates</span>
        <EntityListbox 
          entities={templates}
          selected={selectedTemplate}
          setSelected={setSelectedTemplate}
          ItemButtons={DeleteIcon}
        />
        <button
          className="w-max bg-neutral-800 rounded-md px-2 text-neutral-400"
          onClick={() => setSelectedTemplate("new")}
        >New</button>
      </div>
      {selectedTemplate &&
        <ActivityTemplateController
          templateId={selectedTemplate}
        />}
    </div>
  )
}