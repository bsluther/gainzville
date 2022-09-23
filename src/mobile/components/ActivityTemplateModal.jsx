import { Modal } from "./Modal"

export const ActivityTemplateModal = ({ closeModal }) => {

  return (
    <Modal closeModal={closeModal}>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-11/12 text-neutral-300 bg-neutral-800 space-y-4 p-2 rounded-lg">

          <div className="flex items-center">
            <span>Activity Name:</span>
            <input className="h-max bg-neutral-400 rounded-sm grow" />
          </div>
          
          <div className="flex space-x-2">
            <span>Description:</span>
            <textarea className="bg-neutral-400 rounded-sm grow"/>
          </div>
          
          <span>Aliases:</span>
        </div>
        
      </div>
    </Modal>
  )
}