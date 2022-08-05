import { map } from "ramda"



export const EntityListbox = ({ entities, selected, setSelected, ItemButtons }) => {

  return (
    <ol
      className="
        bg-neutral-500
        border-2 border-neutral-800 rounded-md
        cursor-pointer
      "
    >
      {map(ent => 
            <li
              key={ent.id}
              className={`
                flex items-center
                h-6
                px-2
                first:rounded-t-md last:rounded-b-md
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
                  className={`${selected === ent.id ? "visible" : "invisible"}`} />}
            </li>)
          (entities)}
    </ol>
  )
}