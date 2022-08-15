import { map } from "ramda";
import { FacetInstance } from "../facet/FacetInstance";
import { snakeToSpace } from "../../utility/fns";
import { getInstance, InstanceContext } from "../../state/activityInstanceReducer";
import { DotsVerticalSVGWithRef } from "../../svg/DotsVerticalSVG";
import { useState } from "react";
import { useUserFacetTemplates } from "../../hooks/facet/useUserFacetTemplates";
import { ChevronUpSVG } from "../../svg/ChevronUpSVG";
import { useTypeTemplates } from "../../hooks/type/useTypeTemplates";
import { useRef } from "react";
import { useCallback } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useContext } from "react";



const FacetLi = ({ facetTemplate, handleAddFacet }) => {
  const typeTemplatesQ = useTypeTemplates(facetTemplate.fields)

  if (!typeTemplatesQ.reduce((acc, x) => acc && x.isSuccess, true)) { return <li>...</li>}

  return (
    <li 
      className="cursor-pointer hover:text-yellow-300 capitalize border-b border-neutral-800 pl-2"
      onClick={() => handleAddFacet(facetTemplate)(typeTemplatesQ.map(query => query.data))}
    >{snakeToSpace(facetTemplate.name)}</li>
  )
}

const OptionsMenu = ({ handleAddFacet, optionsIconRef, closeMenu }) => {
  const facetTemplatesQ = useUserFacetTemplates("dev2")
  const [submenu, setSubmenu] = useState(null)
  const menuRef = useRef()

  useOutsideClick([menuRef, optionsIconRef], closeMenu)

  const facetTemplates = facetTemplatesQ.isSuccess ? facetTemplatesQ.data : []

  return (
    <div
      className="
        absolute top-0 left-full
        w-48 h-max
        border-2 border-neutral-800
        bg-neutral-400
        flex flex-col
        p-2
      "
      ref={menuRef}
    >
      <div
        className="flex items-center hover:text-yellow-300"
        onClick={() => submenu === "addFacet" ? setSubmenu(null) : setSubmenu("addFacet")}
      >
        <span 
          className="capitalize hover:text-yellow-300 cursor-pointer grow"
        >add facet</span>
        {submenu === "addFacet" && <ChevronUpSVG className="w-4 h-4 mr-2" />}
      </div>
      {submenu === "addFacet" &&
        <ol
          className="
            border-l border-neutral-800
            ml-4 mr-2
          "
        >
          {facetTemplates.map(template =>
            <FacetLi key={template.id} facetTemplate={template} handleAddFacet={handleAddFacet} />)}
        </ol>
      }
    </div>
  )
}

export const ActivityInstancePresenter = ({ Context, template, handleSaveChanges }) => {
  const [optionsOpen, setOptionsOpen] = useState(false)
  const optionsIconRef = useRef()
  const [store, dispatch] = useContext(Context)

  const handleAddFacet = facetTemplate => typeTemplates => dispatch({
    type: "addFacet",
    payload: {
      facetTemplate,
      typeTemplates
    }
  })

  const closeMenu = useCallback(() => setOptionsOpen(false))
  return (
    <div
      className="
        rounded-md bg-neutral-500
        w-max
        flex flex-col
      "
    >
      <div
        className="grow flex bg-neutral-800 justify-center items-center relative
          rounded-t-md border-t-2 border-x-2 border-neutral-800 py-1"
      >
        <div className="h-full w-full flex items-center">
          <span 
            style={{ width: `${optionsIconRef.current?.clientWidth}px` }}
          />
          <span
          className="
            grow px-2 text-center bg-neutral-800 font-semibold text-lg text-neutral-300 uppercase"
          >
            {template.name}
          </span>
          <DotsVerticalSVGWithRef
            ref={optionsIconRef}
            className="w-6 h-6 text-neutral-300 hover:text-yellow-300 cursor-pointer"
            onClick={() => setOptionsOpen(prev => !prev)}
          />
          {optionsOpen &&
            <OptionsMenu
              closeMenu={closeMenu}
              optionsIconRef={optionsIconRef}
              handleAddFacet={handleAddFacet}
            />
          }
        </div>
      </div>

      <div
        className="
          px-2 py-3 space-y-3 border-b-2 border-x-2 border-neutral-800 rounded-b-md
          flex flex-col
        "
      >
        {map(id => <FacetInstance
          Context={Context}
          key={id}
          facetTemplateId={id}
          address={{ facet: id }} />)(Object.keys(store.instance.facets))}
        <span className="h-2"/>
        <button
          className={`
          border-2 border-neutral-800 rounded-md
          bg-neutral-800
          px-2
          w-max
          self-center
          ${store?.hasChanged ? "text-neutral-200 hover:text-yellow-300" : "text-neutral-500"}
          `}
          disabled={!store?.hasChanged}
          onClick={() => handleSaveChanges(store.instance)}
          >Save Changes</button>
      </div>
    </div>
  );
};
