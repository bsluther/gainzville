import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ActivityTemplateController } from "../../components/activity/ActivityTemplateController"
import { BookmarkDialog } from "./../../components/BookmarkDialog"

export const TemplateCreate = () => {
  const navigate = useNavigate()
  const [bookmarking, setBookmarking] = useState(false)
  const stopBookmarking = () => {
    setBookmarking(false)
    navigate(-1)
  }

  return (
    <div className="w-max h-max relative">
      <ActivityTemplateController
        templateId="new"
        handleSaveNewTemplate={tmpl => {
          setBookmarking(tmpl)
        }}
      />
      {bookmarking && 
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2">
          <BookmarkDialog 
            template={bookmarking}
            stopBookmarking={stopBookmarking}
          />
        </div>}
    </div>
  )
}