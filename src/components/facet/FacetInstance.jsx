import { useState, useCallback, useRef, useContext } from "react"
import { useEntity } from "../../hooks/queries/entity/useEntity"
import { useOutsideClick } from "../../hooks/useOutsideClick"
import { CogSVGWithRef } from "../../svg/CogSVG"
import { TypeInstance } from "../type/instance/TypeInstance"

export const FacetInstance = ({ Context, facetTemplateId, address, facetBgColor, fieldBgColor, textColor, ...props }) => {
  const facetTemplateQuery = useEntity(facetTemplateId, { 
    enabled: !!facetTemplateId
  })
  const [, dispatch] = useContext(Context)


  const handleRemoveFacet = () =>
    dispatch({
      type: "removeFacet",
      payload: address.facet
    })

  const [showOptionIcon, setShowOptionIcon] = useState(false)
  const [optionsOpen, setOptionsOpen] = useState(false)
  const optionsIconRef = useRef()

  const closeMenu = useCallback(() => {
    setOptionsOpen(false)
  }, [setOptionsOpen])

  return (
    <div className="relative w-max" {...props}>
      <div 
        className={`
          border-2 ${props.borderColor ? props.borderColor : "border-neutral-800"} rounded-lg
          ${facetBgColor ?? 'bg-neutral-400'}
          ${textColor}
          pl-2 pr-2 py-1
          w-max
          cursor-default
        `}
        onContextMenu={e => {
          e.preventDefault()
          console.log("context menu")
        }}
        onMouseEnter={() => setShowOptionIcon(true)}
        onMouseLeave={() => setShowOptionIcon(false)}
      >
        {facetTemplateQuery.isSuccess && (
          <div
            className="flex items-center space-x-3"
          >
            <span>{facetTemplateQuery.data.name}</span>
            {facetTemplateQuery.data.fields.map((typeId, ix) => 
              <TypeInstance
                Context={Context}
                key={`${ix}-${typeId}`} 
                typeTemplateId={typeId} 
                address={{ ...address, field: ix }}
                fieldBgColor={fieldBgColor}
              />)}
      
            {(showOptionIcon || optionsOpen) && 
              <CogSVGWithRef
                fill="rgb(163 163 163 / var(--tw-bg-opacity))"
                className="
                  w-6 h-6
                  absolute -top-3 -right-3
                  cursor-pointer
                  z-50
                "
                onClick={e => {
                  setOptionsOpen(prev => !prev)
                }}
                ref={optionsIconRef}
              />}
            {optionsOpen &&
              <div className="absolute top-0 left-full z-50">
                <OptionsMenu
                  closeMenu={closeMenu}
                  optionsIconRef={optionsIconRef}
                  handleRemoveFacet={handleRemoveFacet}
                />
              </div>}
          </div>
          
        )}
      </div>
    </div>
  )
}



const OptionsMenu = ({ closeMenu, optionsIconRef, handleRemoveFacet }) => {
  const menuRef = useRef()

  useOutsideClick([menuRef, optionsIconRef], closeMenu)

  return (
    <ul
      ref={menuRef}
      className="
        text-sm cursor-pointer
        w-max h-max
        px-1 space-y-0.5 py-0.5
        border-2 border-neutral-800
        bg-neutral-400
      "
    >
      <li
        className="hover:text-yellow-200"
        onClick={handleRemoveFacet}
      >Remove Facet</li>
      <li className="hover:text-yellow-200">Hide Facet</li>
      <li className="hover:text-yellow-200">Set as Default Value</li>
      <li className="hover:text-yellow-200">Make Bilateral</li>
    </ul>
  )
}