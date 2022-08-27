

export const WithIcons = ({ icons, children }) => {

  return (
    <div className="relative w-max h-max">
      {children}
      <div
        className="absolute"
      >
        {icons}
      </div>
    </div>
  )
}