import { useCallback, useContext, useRef, useMemo, useState, useLayoutEffect } from "react"
import { keys, map, pipe, prop, values } from "ramda"
import { allSucceeded, snakeToSpace } from "../../utility/fns"
import { useOutsideClick } from "../../hooks/useOutsideClick"
import { DotsVerticalSvg } from "../../svg/DotsVerticalSvg"
import { ChevronUpSVG } from "../../svg/ChevronUpSVG"
import { FacetInstance } from "../facet/FacetInstance"
import { FacetEditor } from "../facet/FacetEditor"
import { getInstance } from "../../state/activityInstanceReducer"

import { useFacetTemplates } from "../../hooks/queries/facet/useFacetTemplates"
import { useTypeTemplates } from "../../hooks/queries/type/useTypeTemplates"
import { useEffect } from "react"
import { ChevronDoubleDown } from "../../svg/ChevronDoubleDown"
import { useEntities } from "../../hooks/queries/entity/useEntities"

export const ActivityInstancePresenter = ({ Context, template, handleSaveChanges }) => {
  const [optionsOpen, setOptionsOpen] = useState(false)
  const optionsIconRef = useRef()
  const [store, dispatch] = useContext(Context)
  const [creatingFacet, setCreatingFacet] = useState(false)

  const handleAddFacet = (facetTemplate, typeTemplates) => dispatch({
    type: "addFacet",
    payload: {
      facetTemplate,
      typeTemplates
    }
  })

  const facetIds = useMemo(() => 
    pipe(getInstance, prop("facets"), keys)
        (store),
    [store])

  const closeMenu = useCallback(() => setOptionsOpen(false))

  return (
    <div
      className="
        rounded-md bg-neutral-500
        w-max
        flex flex-col
        min-w-[20rem]
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
          <DotsVerticalSvg
            ref={optionsIconRef}
            className="w-6 h-6 text-neutral-300 hover:text-yellow-300 cursor-pointer"
            onClick={() => setOptionsOpen(prev => !prev)}
          />
          {optionsOpen &&
            <OptionsMenu
              closeMenu={closeMenu}
              optionsIconRef={optionsIconRef}
              handleAddFacet={handleAddFacet}
              setCreatingFacet={setCreatingFacet}
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
        {map(id =>
              <FacetInstance
                Context={Context}
                key={id}
                facetTemplateId={id}
                address={{ facet: id }}
              />)
            (facetIds)}
        {creatingFacet && 
          <FacetEditor 
            templateId="new" 
            closeEditor={() => setCreatingFacet(false)}
            handleSave={handleAddFacet}
          />}
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
          onClick={() => handleSaveChanges(getInstance(store))}
          >Save Changes</button>
      </div>
    </div>
  )
}


const useScrolled = ref => {
  const [scrolled, setScrolled] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (el) {
      const scrollBottom = el.scrollHeight - el.clientHeight
  
      const updateScroll = () => {
        if (el.scrollTop === scrollBottom) {
          setScrolled(true)
        }
        else {
          setScrolled(false)
        }
      }
      updateScroll()
      el.addEventListener("scroll", updateScroll)
  
      return () => el.removeEventListener("scroll", updateScroll)
    }
    else {
      setScrolled(true)
    }
  }, [ref.current, ref.current?.clientHeight])

  return scrolled
}


const OptionsMenu = ({ handleAddFacet, optionsIconRef, closeMenu, setCreatingFacet }) => {
  const facetTemplatesQ = useFacetTemplates()
  const [submenu, setSubmenu] = useState(null)
  const menuRef = useRef()
  const olRef = useRef()
  const scrolled = useScrolled(olRef)

  useOutsideClick([menuRef, optionsIconRef], closeMenu)

  const facetTemplates = facetTemplatesQ.isSuccess ? facetTemplatesQ.data : []

  return (
    <div
      className="
        absolute top-0 left-full
        w-48
        NOmax-h-64 NOoverflow-scroll NOno-scrollbar
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
      {/* {submenu === "addFacet" && */}
        <ol
          ref={olRef}
          className={`
            ${submenu === "addFacet" ? "" : "hidden"}
            relative
            border-l border-neutral-800
            ml-4 mr-2
            max-h-64 overflow-scroll no-scrollbar
          `}
        >
          <li 
            className="cursor-pointer hover:text-yellow-300 border-b border-neutral-800 pl-2"
            onClick={() => {
              setCreatingFacet(true)
              setSubmenu(null)
              closeMenu()
            }}
          >+ new facet</li>
          {facetTemplates.map(template =>
            <FacetLi key={template.id} facetTemplate={template} handleAddFacet={handleAddFacet} />)}
        </ol>
          {!scrolled && submenu === "addFacet" && <ChevronDoubleDown className="w-5 h-5 self-center opacity-50 mt-1" />}
      {/* } */}
    </div>
  )
}



const FacetLi = ({ facetTemplate, handleAddFacet }) => {
  const typeTemplatesQ = useEntities(facetTemplate.fields)

  if (!allSucceeded(values(typeTemplatesQ))) {
    return <li>...</li>
  }

  const typeTemplates = values(typeTemplatesQ).map(qry => qry.data)

  return (
    <li 
      className="cursor-pointer hover:text-yellow-300 capitalize border-b border-neutral-800 pl-2"
      onClick={() => handleAddFacet(facetTemplate, typeTemplates)}
    >{snakeToSpace(facetTemplate.name)}</li>
  )
}