import { createPortal } from "react-dom"
import { XCircleSvg } from "../../svg/XCircleSvg"

export const Modal = ({ closeModal, children }) => {
  const appEl = document.getElementById("mobile-app")

  return createPortal(
    <div
      className="fixed w-full h-full w-screenNO h-screenNO flex flex-col space-y-8 items-center justify-center backdrop-blur-md"
    >
      <XCircleSvg 
        className="w-8 h-8 text-neutral-200 fixed top-4 right-4" 
        onClick={closeModal}
      />
      {children}
    </div>,
    appEl
  )
}