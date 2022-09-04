import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ActivityTemplateController } from "../../components/activity/ActivityTemplateController"
import { BookmarkDialog } from "./../../components/BookmarkDialog"

export const TemplateCreate = ({ handleSaveNewTemplate }) => {
  const navigate = useNavigate()
  const [bookmarking, setBookmarking] = useState(false)
  const stopBookmarking = template => {
    setBookmarking(false)
    navigate(`../instance-new?templateId=${template.id}`)
  }

  return (
    <div className="w-max h-max relative">
      <ActivityTemplateController
        templateId="new"
        handleSaveNewTemplate={tmpl => {
          setBookmarking(tmpl)
          handleSaveNewTemplate(tmpl)
        }}
      />
      {bookmarking && 
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2">
          <BookmarkDialog 
            template={bookmarking}
            stopBookmarking={() => stopBookmarking(bookmarking)}
          />
        </div>}
    </div>
  )
}