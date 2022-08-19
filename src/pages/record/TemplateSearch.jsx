import { useState } from "react"
import { ActivityTemplateSearch } from "../../components/activity/ActivityTemplateSearch"
import { WithTooltip } from "../../components/WithTooltip"
import { BookmarkSvg } from "../../svg/BookmarkSvg"
import { RecordSvg } from "../../svg/RecordSvg"
import { BookmarkDialog } from "./BookmarkDialog"


export const TemplateSearch = () => {
  const [bookmarking, setBookmarking] = useState(false)

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
          onClick={() => console.log(`Recording ${id}`)}
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
          className="absolute left-1/2 bottom-1/2 -translate-x-1/2 translate-y-1/2"
        >
          
          <BookmarkDialog
            template={bookmarking}
            stopBookmarking={() => setBookmarking(null)}
          />

        </div>}
    </div>
  )
}

