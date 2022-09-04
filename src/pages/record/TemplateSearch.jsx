import { useState } from "react"
import { ActivityTemplateSearch } from "../../components/activity/ActivityTemplateSearch"
import { WithTooltip } from "../../components/WithTooltip"
import { BookmarkSvg } from "../../svg/BookmarkSvg"
import { RecordSvg } from "../../svg/RecordSvg"
import { BookmarkDialog } from "../../components/BookmarkDialog"
import { createSearchParams, useNavigate, useParams } from "react-router-dom"


export const TemplateSearch = () => {
  const [bookmarking, setBookmarking] = useState(false)
  const navigate = useNavigate()

  const ResultButtons = ({ id, template }) =>
    <>
      <WithTooltip tip="Save to library">
        <BookmarkSvg
          className="w-4 h-4 text-neutral-300 cursor-pointer hover:text-yellow-300"
          onClick={() => setBookmarking(template)}
        />
      </WithTooltip>
      <WithTooltip tip="Record instance">
        <RecordSvg
          className="w-4 h-4 text-neutral-300 cursor-pointer hover:text-yellow-300"
          onClick={() => 
            navigate({
              pathname: `../instance-new`,
              search: createSearchParams({
                templateId: id
              }).toString()
            })
          }
        />
      </WithTooltip>
    </>

  return (
    <div className="relative w-max h-max">
      <ActivityTemplateSearch
        title="Activities"
        handleSelect={id => console.log(id)}
        ResultButtons={ResultButtons}  
      />
      {bookmarking && 
        <div
          className="absolute left-1/2 top-1/4 -translate-x-1/2 translate-y-1/2NOT"
        >
          
          <BookmarkDialog
            template={bookmarking}
            stopBookmarking={() => setBookmarking(null)}
          />

        </div>}
    </div>
  )
}

