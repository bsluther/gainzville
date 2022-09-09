

// isInLibrary :: Library -> Template -> Boolean

// isInLibraryById :: LibraryId -> TemplateId -> Result(Boolean)

export const ActivityTemplateBrowser = () => {

  return (
    <div
      className="bg-neutral-800 w-full h-full flex flex-col items-center px-4"
    >
      <div className="w-full">
        <input
          // style={{ 
          //   backgroundImage: `url("data:image/svg+xml,%3Csvg class='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'%3E%3C/path%3E%3C/svg%3E")`,
          //   backgroundRepeat: 'no-repeat'
          // }}
          type="search"
          className="bg-searchSvg bg-no-repeat bg-clip-padding bg-right rounded-md outline-none w-full text-lg px-1 py-1 placeholder:text-neutral-500 placeholder:text-center"
          placeholder="Search Templates"
        />
      </div>
    </div>
  )
}