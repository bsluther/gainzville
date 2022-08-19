import { map } from "ramda"

// Change the ItemButtons className prop to a style prop? Eg EntityListbox expects an ItemButtons component which
// will provide a className prop - that prop may be a function, which will be provided the "selected" argument

export const EntityListbox = ({ entities = [], selected, setSelected, ItemButtons }) => {

  return (
    <ol
      className="
        h-full w-full
        bg-neutral-400
        border-2 border-neutral-800 rounded-md
        cursor-pointer
      "
    >
      {map(ent => 
            <li
              key={ent.id}
              className={`
                flex items-center
                h-max
                px-3 py-1
                rounded-t-md rounded-b-md
                text-black
                ${selected === ent.id
                    ? "bg-yellow-300 hover:bg-yellow-300"
                    : "hover:bg-neutral-450"}
              `}
              onClick={() => 
                selected === ent.id
                  ? setSelected(null)
                  : setSelected(ent.id)}
            >
              <span
                className="grow pr-4"
              >{ent.name}</span>

              {ItemButtons && 
                <ItemButtons 
                  id={ent.id} 
                  className={`${selected === ent.id || "hidden"}`} />}
            </li>)
          (entities)}
    </ol>
  )
}