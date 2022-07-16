

const MenuButton = props =>
  <button
    {...props}
    className="
      text-neutral-400
      px-2 py-1
      w-max h-max bg-neutral-800
      rounded-md
    "
  >
    {props.children}
  </button>

export const MainMenu = () => {

  return (
    <div
      className="
        flex 
        border-2 border-neutral-800
        w-max h-max
        p-2 space-x-2
      "
    >
      <MenuButton>
        Create Activity Template
      </MenuButton>
      <MenuButton>
        Create Facet Template
      </MenuButton>
    </div>
  )
}