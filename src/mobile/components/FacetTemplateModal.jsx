import { createPortal } from "react-dom"
import { XCircleSvg } from "../../svg/XCircleSvg"

export const FacetTemplateModal = ({ closeModal }) => {
  const appEl = document.getElementById("mobile-app")
  console.log('hi')

  return createPortal(
    <div
      className="fixed w-full h-full flex flex-col p-3 space-y-2 items-center justify-centerNO backdrop-blur-md"
    >
      <XCircleSvg
        className="w-8 h-8 text-neutral-200 fill-neutral-800 fixed top-3 right-3" 
        onClick={closeModal}
      />
      <span>Dead end... sorry.</span>
    </div>,
    appEl
  )
}