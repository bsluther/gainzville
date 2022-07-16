import { map } from "ramda";
import { FacetInstance } from "../facet/FacetInstance";
import { snakeToSpace } from "../../utility/fns";
import { getInstance, InstanceContext } from "../../state/activityInstanceReducer";
import { DotsVerticalSVG, DotsVerticalSVGWithRef } from "../../svg/DotsVerticalSVG";
import { useState } from "react";
import { useUserFacetTemplates } from "../../hooks/facet/useUserFacetTemplates";
import { ChevronUpSVG } from "../../svg/ChevronUpSVG";
import { useTypeTemplates } from "../../hooks/type/useTypeTemplate";
import { useRef } from "react";
import { useCallback } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";



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




export const ActivityInstancePresenter = ({ store, dispatch, template, handleSaveChanges }) => {
  const [optionsOpen, setOptionsOpen] = useState(false)
  const optionsIconRef = useRef()
  
  const handleAddFacet = facetTemplate => typeTemplates => dispatch({
    type: "addFacet",
    payload: {
      facetTemplate,
      typeTemplates
    }
  })

  const closeMenu = useCallback(() => setOptionsOpen(false))

  return (
    <InstanceContext.Provider value={[getInstance(store), dispatch]}>
      <div
        className="
          border-2 border-neutral-800 rounded-md bg-neutral-500
          w-max
          flex flex-col
        "
      >
        <div
          className="grow flex bg-neutral-700 justify-center relative
            rounded-t-sm border-b-2 border-neutral-800"
        >
          <span
          className="
            font-semibold text-lg  
             text-neutral-400 uppercase"
          >
            {snakeToSpace(template.name)}
          </span>
          <DotsVerticalSVGWithRef
            ref={optionsIconRef}
            className="w-6 h-6 absolute right-0 top-0.5 text-neutral-400 hover:text-yellow-300 cursor-pointer"
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

        <div className="px-2 py-3 space-y-3">
          {map(id => <FacetInstance
            key={id}
            facetTemplateId={id}
            address={{ facet: id }} />)(Object.keys(store.instance.facets))}
        </div>
        <button
          className={`
            border-2 border-neutral-800 rounded-md
            bg-neutral-600
            px-2 mb-2 mr-2
            w-max
            self-end
            ${store?.hasChanged ? "text-neutral-200 hover:text-yellow-300" : "text-neutral-800"}
          `}
          disabled={!store?.hasChanged}
          onClick={() => handleSaveChanges(store.instance)}
        >Save Changes</button>
      </div>
    </InstanceContext.Provider>
  );
};
